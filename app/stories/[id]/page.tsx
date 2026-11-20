import { permanentRedirect } from "next/navigation";
// Earlier story URLs now lead to the brand's supplied collection story.
export default function Page(){permanentRedirect("/stories");}
