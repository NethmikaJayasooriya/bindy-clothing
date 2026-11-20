import assets from "@/data/story-assets.json";

export const EDITORIAL_KEYS = ["about", "stories"] as const;
export type EditorialKey = typeof EDITORIAL_KEYS[number];
export const SECTION_LAYOUTS = ["split", "text", "quote", "values", "palette", "gallery"] as const;
export interface EditorialItem { id: string; title: string; body: string; image: string; alt: string; colour: string }
export interface EditorialSection {
  id: string; layout: typeof SECTION_LAYOUTS[number]; published: boolean;
  eyebrow: string; title: string; body: string; image: string; alt: string;
  imageSide: "left" | "right"; tone: "paper" | "white" | "ink";
  link: string; linkLabel: string; items: EditorialItem[];
}
export interface EditorialPageContent {
  published: boolean; navLabel: string; title: string; accent: string; eyebrow: string;
  intro: string; image: string; alt: string; imagePosition: string;
  link: string; linkLabel: string; seoTitle: string; seoDescription: string;
  sections: EditorialSection[];
}
export type EditorialContent = Record<EditorialKey, EditorialPageContent>;
export type PublicEditorial = Record<EditorialKey, EditorialPageContent | null>;
export function editorialEqual(a:unknown,b:unknown):boolean {
  const stable=(v:unknown)=>JSON.stringify(v,(_key,value)=>value&&typeof value==="object"&&!Array.isArray(value)?Object.fromEntries(Object.keys(value).sort().map(key=>[key,value[key]])):value);
  return stable(a)===stable(b);
}
const item = (id: string, title: string, body: string, image = "", colour = ""): EditorialItem => ({id,title,body,image,alt:image?title:"",colour});
const section = (id: string, layout: EditorialSection["layout"], title: string, body: string, extra: Partial<EditorialSection> = {}): EditorialSection => ({id,layout,title,body,published:true,eyebrow:"",image:"",alt:"",imageSide:"left",tone:"paper",link:"",linkLabel:"",items:[],...extra});
export const DEFAULT_EDITORIAL: EditorialContent = {
  about: {
    published:true,navLabel:"Our story",eyebrow:"ABOUT BINDY",title:"Family at heart.",accent:"Care in every thread.",
    intro:"Our brand is built on a family passion for textiles, craftsmanship and quality garment making.",
    image:"/images/bindi-real/campaign-together.webp",alt:"Two friends wearing BINDY floral and sage garments outdoors",imagePosition:"50% 50%",
    link:"/collection",linkLabel:"Explore the collection",seoTitle:"About BINDY · Our family story",seoDescription:"Creative direction from Australia and garments made in our family-owned Sri Lankan factory, established in 2012. Craftsmanship, care and authenticity.",
    sections:[
      section("origins","split","A shared love. A considered way of creating.","With creative direction led from Australia and production based in Sri Lanka, we bring together generations of industry knowledge and a shared love for fashion.",{eyebrow:"TWO ISLANDS. ONE THREAD.",image:assets["thoughtful-wardrobe"],alt:"BINDY brand foundation board showing a considered wardrobe of soft neutral garments",items:[item("australia","Australia","Creative direction"),item("sri-lanka","Sri Lanka","Family-owned production"),item("established","2012","Factory established")]}),
      section("factory","values","One roof. Every detail.","Every garment is designed with care and produced in our family-owned garment factory, established in 2012, where the entire process takes place under one roof, from pattern making and sampling to production, finishing and packing.",{eyebrow:"OUR FAMILY-OWNED GARMENT FACTORY",tone:"ink",items:[item("pattern","Pattern making",""),item("sampling","Sampling",""),item("production","Production",""),item("finishing","Finishing",""),item("packing","Packing","")]}),
      section("family-values","values","Rooted in family. Reflected in every piece.","Being directly connected to every stage of creation allows us to maintain quality while ensuring each piece reflects the values our family has built over the years.",{eyebrow:"THE VALUES WE CARRY",tone:"white",items:[item("craftsmanship","Craftsmanship","Care in the way each garment is made."),item("detail","Attention to detail","Consideration from the first pattern to the final package."),item("authenticity","Authenticity","A shared family passion for textiles and garment making.")]}),
      section("purpose","quote","Made to be worn. Loved. Cherished.","Our goal is to create timeless, thoughtfully made clothing that connects contemporary design with the expertise of Sri Lankan manufacturing, delivering pieces that are made to be worn, loved and cherished for years to come.",{eyebrow:"OUR PURPOSE",link:"/stories",linkLabel:"Discover Bindy Stories"}),
    ],
  },
  stories: {
    published:true,navLabel:"Bindy Stories",eyebrow:"THE BINDY JOURNAL",title:"Simple pieces.",accent:"Meaningful moments.",
    intro:"The ideas, colours and considered details behind BINDY. Designed in Australia. Inspired by Sri Lanka.",
    image:assets["serendipity-portrait"],alt:"BINDY Serendipity collection moodboard portrait in an ivory outfit beside the sea",imagePosition:"50% 0%",
    link:"#serendipity",linkLabel:"Discover Serendipity",seoTitle:"Bindy Stories · The story behind Serendipity",seoDescription:"Explore BINDY's brand foundation, thoughtful design and Serendipity Collection 01: Sri Lankan inspiration reimagined for contemporary Australian living.",
    sections:[
      section("welcome","quote","Wear Your Calm, Feel Your Story","Thoughtfully designed pieces that blend comfort, creativity and quality for the modern woman.",{eyebrow:"WELCOME TO BINDY"}),
      section("foundation","split","Simple. Thoughtful. Special.","We believe the most meaningful clothing is not the loudest. It is the clothing people return to, season after season, because it fits beautifully, feels effortless and becomes part of their everyday story.\n\nThrough thoughtful design and authentic craftsmanship, we create timeless pieces that are simple in appearance, yet special in the way they make women feel.",{eyebrow:"OUR BRAND FOUNDATION",image:assets["thoughtful-wardrobe"],alt:"Soft neutral garments and BINDY clothing tag from the supplied brand foundation board",link:"/about",linkLabel:"Meet BINDY"}),
      section("values","values","Every detail has a reason.","Simple in expression. Thoughtful in creation. Special in experience.",{eyebrow:"THE VALUES BEHIND OUR PIECES",tone:"ink",items:[item("design","Thoughtful design","Every detail has a reason."),item("quality","Quality & craftsmanship","Made with care. Made to be loved."),item("comfort","Comfort with confidence","Feel good. Look effortless."),item("creativity","Timeless creativity","Contemporary, not temporary."),item("connection","Authentic connection","Created by women, for real lives.")]}),
      section("serendipity","split","The beauty of unexpected discovery.","Inspired by Serendib, the ancient name for Sri Lanka, Serendipity explores the meeting of heritage and modernity.\n\nThrough relaxed silhouettes, natural fabrics and subtle handcrafted details, Sri Lankan stories are reimagined for contemporary Australian living. Each piece celebrates the unexpected beauty found in simplicity — something thoughtful, personal and quietly special.",{eyebrow:"COLLECTION 01 / SERENDIPITY",image:assets["coastal-portrait"],alt:"Serendipity collection moodboard showing a soft blue shirt beside the sea",imageSide:"right",link:"/collection",linkLabel:"Explore Collection 01"}),
      section("colour-story","palette","A palette found in nature.","A calming palette inspired by nature and subtle moments of discovery. Soft, harmonious hues that reflect effortless femininity, simplicity and modern elegance.",{eyebrow:"THE SERENDIPITY COLOUR STORY",tone:"white",items:[item("sea","Sea Blue","Depth, calm and quiet strength.",assets["sea-blue"],"#2F4F6F"),item("sand","Sand Beige","Warmth, grounding and natural elegance.",assets["sand-beige"],"#DCC7AF"),item("ivory","Ivory White","Clean, pure and timeless.",assets["ivory-white"],"#F6F5F2"),item("sage","Sage Green","Fresh, natural and balanced.",assets["sage-green"],"#AFC8B1"),item("pastel","Pastel Blue","Airy, serene and peaceful.",assets["pastel-blue"],"#C8D8E6"),item("gem","Gem Blue","Elegant, refined and distinctive.",assets["gem-blue"],"#6FA4B8"),item("cinnamon","Cinnamon","Earthy, rich and comforting.",assets.cinnamon,"#A46446"),item("lotus","Lotus Pink","Soft, romantic and feminine.",assets["lotus-pink"],"#E8B7C3")]}),
      section("studio","gallery","From the BINDY studio.","The original brand and collection boards: our foundation, values, Serendipity concept and colour story. Explore each board in full.",{eyebrow:"THE CREATIVE DIRECTION",items:[item("foundation-board","Brand foundation","Simple. Thoughtful. Special.",assets["brand-foundation"]),item("values-board","Brand values","Designed with purpose. Made to be loved.",assets["brand-values"]),item("story-board","Serendipity","Roots → Journey → Discovery",assets["serendipity-story"]),item("mood-board","Collection moodboard","Calm · Natural · Curious · Feminine · Effortless",assets["serendipity-moodboard"]),item("palette-board","Colour story","Eight nature-inspired shades.",assets["colour-story"]),item("welcome-board","Welcome to BINDY","Sri Lankan soul for Australia.",assets.welcome),item("woman-board","For the modern woman","Comfort, individuality and conscious choices.",assets["modern-woman"]),item("community-board","The BINDY story","Stories, relationships and meaningful fashion.",assets["our-community"])]}),
      section("connection","quote","Thank you for being part of the Bindy story.","Our marketing is about sharing stories, building relationships and creating a movement of mindful and meaningful fashion.",{eyebrow:"OUR COMMUNITY",link:"/collection",linkLabel:"Find your everyday piece"}),
    ],
  },
};

export function publicEditorial(content?: EditorialContent): PublicEditorial {
  const source=content??DEFAULT_EDITORIAL;
  return Object.fromEntries(EDITORIAL_KEYS.map(key=>[key,source[key].published?{...source[key],sections:source[key].sections.filter(s=>s.published)}:null])) as PublicEditorial;
}
