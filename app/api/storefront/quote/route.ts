import {NextResponse} from "next/server";
import {readStore} from "@/lib/server/store-repository";
import {quoteCod} from "@/lib/server/cod-orders";
import {publicInput,publicError} from "@/lib/server/public-requests";
export async function POST(request:Request){try{const input=await publicInput(request,"cod-quote",40);return NextResponse.json(quoteCod(await readStore(),input),{headers:{"Cache-Control":"no-store"}});}catch(e){const error=publicError(e);return NextResponse.json({error:error.message},{status:error.status});}}
