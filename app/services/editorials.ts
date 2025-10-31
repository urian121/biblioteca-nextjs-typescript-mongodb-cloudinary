import { connect } from "@/lib/mongoose";
import { EditorialModel } from "@/models/Editorial";

export type EditorialItem = { id: string; name: string;};

type LeanEditorialDoc = {
  _id: unknown;
  name: string;
};

function toEditorialItem(d: LeanEditorialDoc): EditorialItem {
  return { id: String(d._id), name: d.name };
}

export async function listEditorials(): Promise<EditorialItem[]> {
  await connect();
  const docs = (await EditorialModel.find().sort({ name: 1 }).lean()) as LeanEditorialDoc[];
  return docs.map(toEditorialItem);
}