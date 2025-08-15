import { getUserByIdsLoader } from "./user/data-loaders.ts";
import * as User from "./user/queries.ts";

const types = { User };
const loaders = { getUserByIdsLoader };

export { loaders, types };
