import { AppDataSource } from "../db";
import { Contact } from "../models/contact.model";
import { uniq } from "../utils/identity.util";

const repo = AppDataSource.getRepository(Contact);

/** Walk up linkedId chain and return the root primary */
const findRoot = async (c: Contact): Promise<Contact> => {
    let cur: Contact = c;
    while (cur.linkPrecedence === "secondary" && cur.linkedId) {
        const parent = await repo.findOneBy({ id: cur.linkedId });
        if (!parent) break;
        cur = parent;
    }
    return cur;
};

/**
 * Core “identify” logic.
 * 1. Fetch all contacts that match phone or email.
 * 2. Decide which is primary.
 * 3. Link / merge as needed.
 * 4. Build response.
 */
export const identifyContact = async (args: { email?: string; phoneNumber?: string; }) => {
    const { email, phoneNumber } = args;
    if (!email && !phoneNumber) throw new Error("email or phoneNumber required");

    // fetch candidates
    const candidates = await repo.find({
        where: [
            ...(email ? [{ email }] : []),
            ...(phoneNumber ? [{ phoneNumber }] : [])
        ]
    });

    // no matches, create new primary
    if (candidates.length === 0) {
        const fresh = repo.create({ email, phoneNumber });
        await repo.save(fresh);
        return formatResponse(fresh, []);
    }

    /* 3️⃣ resolve each candidate’s root, then pick the earliest root */
    const roots: Contact[] = [];
    for (const c of candidates) roots.push(await findRoot(c));
    const primary = roots.reduce((a, c) =>
        c.createdAt < a.createdAt ? c : a
    );

    // ensure others are linked as secondary
    for (const c of candidates) {
        if (c.id === primary.id) continue;
        if (c.linkedId !== primary.id || c.linkPrecedence !== "secondary") {
            c.linkPrecedence = "secondary";
            c.linkedId = primary.id;
            await repo.save(c);
            const children = await repo.find({ where: { linkedId: c.id } });
            for (const child of children) {
                child.linkedId = primary.id;
                await repo.save(child);
            }
        }
    }

    // if incoming email/phone not present in any record, add a secondary
    const existsEmail = email
        ? candidates.some(c => c.email === email)
        : true;

    const existsPhone = phoneNumber
        ? candidates.some(c => c.phoneNumber === phoneNumber)
        : true;

    // only add a secondary if at least one *provided* value is genuinely new
    if ((!existsEmail && email) || (!existsPhone && phoneNumber)) {
        const newSecondary = repo.create({
            email,
            phoneNumber,
            linkPrecedence: "secondary",
            linkedId: primary.id
        });
        await repo.save(newSecondary);
    }

    // re-fetch full cluster (primary + secondaries)
    const cluster = await repo.find({
        where: [{ id: primary.id }, { linkedId: primary.id }]
    });

    return formatResponse(primary, cluster);
};

const formatResponse = (primary: Contact, cluster: Contact[]) => {
    const secondaryContacts = cluster
        .filter((c) => c.id !== primary.id)
        .map((c) => c.id);

    return {
        contact: {
            primaryContactId: primary.id,
            emails: uniq([primary.email, ...cluster.map((c) => c.email)]),
            phoneNumbers: uniq([primary.phoneNumber, ...cluster.map((c) => c.phoneNumber)]),
            secondaryContactIds: secondaryContacts
        }
    };
};