function randomInt(min, max) {

    return Math.floor(Math.random() * (max - min + 1) + min);

}

function newDataGen(
    {
        maxLen = 20,
        size = 1,
        min = -1000,
        max = 1000,
        canBeNegative = true
    } = {}) {

    const data = [];
    const labels = [];

    const length = randomInt(5, maxLen);

    for (let i = 0; i < length; i++) {

        labels.push(randomName());

    }

    if (!canBeNegative && min < 0) min = 0

    const factor = randomInt(1, 10);

    data.push(labels);

    for (let s = 0; s < size; s++) {

        const randomMin = (Math.floor(Math.random() * (max - min + 1)) + min) * factor;
        const randomMax = (Math.floor(Math.random() * (max - randomMin + 1)) + randomMin) * factor;

        const seriesArray = [];

        for (let i = 0; i < length; i++) {

            const randomNumber = Math.floor(Math.random() * (randomMax - randomMin) + randomMin);
            seriesArray.push(randomNumber);

        }

        data.push(seriesArray);

    }

    return data;

}

function dataGenerator(maxLen = 20, count = 1, decimal = false, drastic = false, nameLen = 2, negatives = true) {

    let data = [];
    let minMaxes = [];
    let factor = randomInt(3, 9);

    const length = randomInt(5, maxLen);

    for (let i = 0; i < count; i++) {

        let x = randomInt(negatives ? -1000 : 0, 1000);

        minMaxes[i] = [randomInt(negatives ? -2000 : 0, 2000), randomInt(negatives ? -2000 : 0, 2000)];

    }

    for (let i = 0; i < length; i++) {

        let series = [randomName()];

        for (let j = 0; j < count; j++) {

            let x = randomInt(minMaxes[j][0], minMaxes[j][1]);

            if (decimal) x = x / factor;

            if (drastic) x = x * randomInt(2, 20);

            series.push(x);

        }

        data.push(series);

    }

    return data;

}

const cssVar = (name, value) => {

    if (name.substring(0, 2) !== "--") name = "--" + name;

    if (value) document.documentElement.style.setProperty(name, value);

    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();

}

function randomName() {

    return adjectives[randomInt(0, adjectives.length)] + ' ' + nouns[randomInt(0, nouns.length)];

}

const adjectives = [
    "unarmed",
    "sulky",
    "rustic",
    "draconian",
    "chemical",
    "picayune",
    "devilish",
    "temporary",
    "overt",
    "silky",
    "judicious",
    "voiceless",
    "necessary",
    "disgusted",
    "open",
    "wiry",
    "gruesome",
    "materialistic",
    "vigorous",
    "squeamish",
    "assorted",
    "heavenly",
    "symptomatic",
    "evanescent",
    "pointless",
    "truculent",
    "adjoining",
    "amazing",
    "straight",
    "utopian",
    "interesting",
    "mere",
    "grubby",
    "resolute",
    "daily",
    "well-to-do",
    "automatic",
    "eight",
    "glistening",
    "gabby",
    "trite",
    "moaning",
    "strange",
    "puny",
    "noisy",
    "kindly",
    "amuck",
    "brash",
    "rigid",
    "icky",
    "upset",
    "numerous",
    "wet",
    "offbeat",
    "unable",
    "chief",
    "extra-large",
    "curly",
    "spiky",
    "juicy",
    "sharp",
    "aberrant",
    "near",
    "maddening",
    "vivacious",
    "slim",
    "new",
    "well-off",
    "irate",
    "peaceful",
    "agreeable",
    "disturbed",
    "somber",
    "possible",
    "difficult",
    "soggy",
    "ratty",
    "tiny",
    "lewd",
    "bashful",
    "witty",
    "frail",
    "periodic",
    "phobic",
    "measly",
    "abrasive",
    "tearful",
    "slow",
    "disillusioned",
    "shaky",
    "childlike",
    "fine",
    "dependent",
    "famous",
    "greedy",
    "tangible",
    "kind",
    "second",
    "thoughtful",
    "dusty",
    "ruddy",
    "furry",
    "wooden",
    "exultant",
    "troubled",
    "imperfect",
    "waiting",
    "fixed",
    "filthy",
    "huge",
    "penitent",
    "responsible",
    "small",
    "panoramic",
    "cooing",
    "abaft",
    "tender",
    "four",
    "sweet",
    "habitual",
    "aggressive",
    "hapless",
    "groovy",
    "marvelous",
    "dull",
    "late",
    "full",
    "annoying",
    "narrow",
    "better",
    "decisive",
    "painful",
    "five",
    "wacky",
    "woebegone",
    "laughable",
    "impartial",
    "clear",
    "square",
    "sloppy",
    "dreary",
    "squealing",
    "courageous",
    "hateful",
    "sassy",
    "parched",
    "lackadaisical",
    "dead",
    "abiding",
    "coherent",
    "fabulous",
    "guarded",
    "same",
    "internal",
    "adventurous",
    "handsome",
    "annoyed",
    "torpid",
    "wasteful",
    "spooky",
    "abashed",
    "barbarous",
    "like",
    "reflective",
    "addicted",
    "robust",
    "flawless",
    "placid",
    "magical",
    "aromatic",
    "righteous",
    "meek",
    "terrible",
    "macho",
    "faithful",
    "salty",
    "teeny-tiny",
    "beautiful",
    "juvenile",
    "energetic",
    "many",
    "available",
    "heartbreaking",
    "numberless",
    "brown",
    "lavish",
    "remarkable",
    "cute",
    "mushy",
    "even",
    "rural",
    "perfect",
    "loutish",
    "useful",
    "thoughtless",
    "foregoing",
    "scared",
    "weak",
    "fertile",
    "long",
    "flowery",
    "subsequent",
    "flagrant",
    "odd",
    "squalid",
    "disastrous",
    "defective",
    "momentous",
    "faint",
    "striped",
    "satisfying",
    "cute",
    "general",
    "excellent",
    "longing",
    "lame",
    "white",
    "cautious",
    "immense",
    "scrawny",
    "gorgeous",
    "first",
    "mysterious",
    "acrid",
    "bent",
    "stingy",
    "sleepy",
    "capable",
    "tangy",
    "light",
    "cynical",
    "protective",
    "lively",
    "early",
    "fresh",
    "happy",
    "glorious",
    "succinct",
    "racial",
    "enthusiastic",
    "permissible",
    "slimy",
    "needless",
    "imaginary",
    "strong",
    "testy",
    "tense",
    "legal",
    "acceptable",
    "alike",
    "wise",
    "valuable",
    "misty",
    "uttermost",
    "afraid",
    "gray",
    "scintillating",
    "descriptive",
    "puzzling",
    "confused",
    "familiar",
    "uncovered",
    "stormy",
    "wicked",
    "knowing",
    "sweltering",
    "hurt",
    "abusive",
    "unique",
    "jobless",
    "ruthless",
    "tense",
    "unsuitable",
    "receptive",
    "nebulous",
    "tidy",
    "grateful",
    "cultured",
    "dynamic",
    "puzzled",
    "lyrical",
    "calculating",
    "attractive",
    "changeable",
    "clammy",
    "quick",
    "nondescript",
    "naive",
    "overwrought",
    "husky",
    "bumpy",
    "well-made",
    "psychotic",
    "tasty",
    "sore",
    "humorous",
    "opposite",
    "elastic",
    "sick",
    "amusing",
    "brave",
    "chilly",
    "delirious",
    "mean",
    "spectacular",
    "clean",
    "elderly",
    "fearful",
    "lamentable",
    "aback",
    "drunk",
    "dramatic",
    "curvy",
    "halting",
    "powerful",
    "rebel",
    "glib",
    "whole",
    "pretty",
    "bright",
    "steady",
    "tenuous",
    "tasteful",
    "next",
    "silly",
    "petite",
    "cheap",
    "resonant",
    "joyous",
    "divergent",
    "hanging",
    "common",
    "wonderful",
    "madly",
    "equable",
    "quack",
    "tart",
    "living",
    "undesirable",
    "delicate",
    "plain",
    "ceaseless",
    "flashy",
    "mellow",
    "glamorous",
    "fretful",
    "cruel",
    "befitting",
    "plucky",
    "rabid",
    "literate",
    "stimulating",
    "vulgar",
    "enchanting",
    "obsequious",
    "jealous",
    "horrible",
    "kindhearted",
    "warm",
    "unequaled",
    "spiritual",
    "unkempt",
    "hard",
    "simplistic",
    "jumpy",
    "agonizing",
    "spotty",
    "abounding",
    "impolite",
    "previous",
    "probable",
    "questionable",
    "serious",
    "third",
    "old",
    "victorious",
    "spicy",
    "naughty",
    "smiling",
    "closed",
    "garrulous",
    "understood",
    "piquant",
    "scientific",
    "big",
    "acid",
    "important",
    "doubtful",
    "frantic",
    "dirty",
    "workable",
    "ancient",
    "clever",
    "incandescent",
    "fortunate",
    "homeless",
    "public",
    "detailed",
    "recondite",
    "dazzling",
    "observant",
    "obeisant",
    "finicky",
    "thick",
    "exotic",
    "hot",
    "jaded",
    "deranged",
    "chubby",
    "imminent",
    "disagreeable",
    "purring",
    "excited",
    "smoggy",
    "wistful",
    "thirsty",
    "scattered",
    "guiltless",
    "crooked",
    "special",
    "milky",
    "tricky",
    "idiotic",
    "invincible",
    "green",
    "tested",
    "tacit",
    "hilarious",
    "empty",
    "giddy",
    "evasive",
    "vague",
    "unruly",
    "macabre",
    "diligent",
    "loose",
    "awesome",
    "savory",
    "ten",
    "shallow",
    "oval",
    "actually",
    "auspicious",
    "fair",
    "ill-informed",
    "skinny",
    "hypnotic",
    "tremendous",
    "half",
    "quizzical",
    "miscreant",
    "impossible",
    "complex",
    "verdant",
    "hollow",
    "yellow",
    "functional",
    "expensive",
    "bite-sized",
    "one",
    "gaping",
    "cheerful",
    "worthless",
    "exciting",
    "sincere",
    "separate",
    "wry",
    "heady",
    "worried",
    "graceful",
    "smart",
    "high-pitched",
    "snotty",
    "bright",
    "muddled",
    "hissing",
    "inconclusive",
    "red",
    "bawdy",
    "orange",
    "lush",
    "holistic",
    "sad",
    "discreet",
    "long-term",
    "unwritten",
    "heavy",
    "telling",
    "cut",
    "waggish",
    "makeshift",
    "blue-eyed",
    "feeble",
    "intelligent",
    "mountainous",
    "productive",
    "calm",
    "forgetful",
    "stereotyped",
    "two",
];
const nouns = [
    "invention",
    "dinosaurs",
    "experience",
    "side",
    "team",
    "muscle",
    "request",
    "pizzas",
    "leather",
    "level",
    "cabbage",
    "honey",
    "meeting",
    "books",
    "taste",
    "night",
    "geese",
    "sheet",
    "driving",
    "fowl",
    "pipe",
    "dust",
    "grandmother",
    "plants",
    "beds",
    "addition",
    "liquid",
    "frame",
    "snake",
    "minister",
    "view",
    "crook",
    "giraffe",
    "flame",
    "flowers",
    "grape",
    "week",
    "motion",
    "distribution",
    "earth",
    "play",
    "wire",
    "island",
    "riddle",
    "plot",
    "trade",
    "sidewalk",
    "use",
    "chess",
    "arch",
    "hook",
    "bucket",
    "reward",
    "boot",
    "instrument",
    "badge",
    "thumb",
    "rice",
    "locket",
    "discussion",
    "magic",
    "tank",
    "dad",
    "selection",
    "snail",
    "mouth",
    "mitten",
    "coil",
    "cactus",
    "committee",
    "legs",
    "number",
    "trousers",
    "wave",
    "partner",
    "veil",
    "screw",
    "rat",
    "cannon",
    "elbow",
    "shame",
    "smile",
    "letters",
    "pets",
    "apparel",
    "meal",
    "horses",
    "wing",
    "scissors",
    "camera",
    "fruit",
    "drink",
    "hammer",
    "babies",
    "jail",
    "purpose",
    "degree",
    "soup",
    "uncle",
    "exchange",
    "digestion",
    "control",
    "insurance",
    "ticket",
    "throat",
    "home",
    "vessel",
    "year",
    "cattle",
    "form",
    "soap",
    "crow",
    "care",
    "knife",
    "hate",
    "quicksand",
    "cause",
    "boy",
    "scarf",
    "person",
    "amount",
    "quartz",
    "bee",
    "rhythm",
    "territory",
    "linen",
    "industry",
    "existence",
    "key",
    "ladybug",
    "summer",
    "word",
    "blade",
    "order",
    "rain",
    "mine",
    "ray",
    "robin",
    "price",
    "shape",
    "twist",
    "voice",
    "branch",
    "increase",
    "health",
    "pear",
    "hat",
    "hall",
    "edge",
    "train",
    "bone",
    "quiet",
    "scale",
    "approval",
    "shade",
    "dogs",
    "burst",
    "cellar",
    "force",
    "sack",
    "baseball",
    "match",
    "seed",
    "point",
    "war",
    "sweater",
    "sofa",
    "cable",
    "start",
    "window",
    "vacation",
    "jewel",
    "lunch",
    "front",
    "toys",
    "quiver",
    "rings",
    "jump",
    "girl",
    "believe",
    "flesh",
    "chance",
    "teaching",
    "measure",
    "shock",
    "history",
    "brother",
    "part",
    "plate",
    "queen",
    "card",
    "representative",
    "sheep",
    "sugar",
    "hydrant",
    "bead",
    "wish",
    "eggs",
    "toothpaste",
    "shirt",
    "transport",
    "wax",
    "curtain",
    "friends",
    "wrench",
    "company",
    "sponge",
    "mailbox",
    "cough",
    "base",
    "fairies",
    "creator",
    "juice",
    "bed",
    "plane",
    "competition",
    "direction",
    "comparison",
    "umbrella",
    "canvas",
    "minute",
    "border",
    "verse",
    "toy",
    "gold",
    "calculator",
    "nerve",
    "clam",
    "yoke",
    "country",
    "coach",
    "spark",
    "thrill",
    "grain",
    "afternoon",
    "mice",
    "cemetery",
    "wash",
    "bikes",
    "pet",
    "tax",
    "thunder",
    "sleet",
    "route",
    "name",
    "sea",
    "scent",
    "lip",
    "poison",
    "lock",
    "channel",
    "curve",
    "vein",
    "cart",
    "blow",
    "hands",
    "advice",
    "mom",
    "size",
    "bridge",
    "respect",
    "walk",
    "cakes",
    "beef",
    "arm",
    "rake",
    "cake",
    "pickle",
    "shake",
    "land",
    "throne",
    "move",
    "silver",
    "tent",
    "show",
    "tramp",
    "cushion",
    "earthquake",
    "sister",
    "trouble",
    "songs",
    "drain",
    "memory",
    "horn",
    "board",
    "fact",
    "system",
    "giants",
    "drawer",
    "effect",
    "caption",
    "cast",
    "waves",
    "trip",
    "yarn",
    "wall",
    "pull",
    "man",
    "bomb",
    "pies",
    "sense",
    "error",
    "roll",
    "treatment",
    "guitar",
    "north",
    "quill",
    "whip",
    "bear",
    "animal",
    "pump",
    "rock",
    "doll",
    "shoe",
    "tail",
    "belief",
    "cobweb",
    "metal",
    "mint",
    "religion",
    "wilderness",
    "look",
    "tongue",
    "touch",
    "paper",
    "skate",
    "top",
    "lunchroom",
    "deer",
    "event",
    "need",
    "women",
    "monkey",
    "yam",
    "writer",
    "bottle",
    "suggestion",
    "balance",
    "hobbies",
    "ink",
    "zipper",
    "men",
    "thing",
    "love",
    "rule",
    "rub",
    "bushes",
    "song",
    "jellyfish",
    "flock",
    "haircut",
    "grandfather",
    "notebook",
    "power",
    "back",
    "loss",
    "distance",
    "milk",
    "wood",
    "lettuce",
    "stone",
    "house",
    "hose",
    "record",
    "door",
    "hole",
    "attack",
    "insect",
    "celery",
    "birthday",
    "parcel",
    "relation",
    "note",
    "oranges",
    "suit",
    "porter",
    "fly",
    "food",
    "discovery",
    "maid",
    "division",
    "wren",
    "sisters",
    "bells",
    "texture",
    "fork",
    "doctor",
    "head",
    "straw",
    "knowledge",
    "nut",
    "rose",
    "calendar",
    "fang",
    "stage",
    "snow",
    "mountain",
    "cracker",
    "swim",
    "grip",
    "horse",
    "test",
    "hand",
    "dog",
    "stomach",
    "toes",
    "stove",
    "bit",
    "skirt",
    "morning",
    "cloth",
    "knot",
    "sound",
    "run",
    "wrist",
    "rabbit",
    "quilt",
    "thread",
    "spring",
    "building",
    "weather",
    "stocking",
    "quince",
    "river",
    "toe",
    "seashore",
    "chickens",
    "square",
    "twig",
    "government",
    "surprise",
    "steel",
    "pen",
    "shop",
    "oven",
    "decision",
    "seat",
    "bike",
    "kettle",
    "gate",
    "change",
    "oatmeal",
    "fog",
    "volcano",
    "van",
    "month",
    "flight",
    "color",
    "middle",
    "apparatus",
    "club",
    "library",
    "flag",
    "jelly",
    "fall",
    "attraction",
    "self",
    "houses",
    "hill",
    "cow",
    "achiever",
    "friend",
    "line",
    "hospital",
    "voyage",
    "stamp",
    "book",
    "group",
    "fireman",
    "friction",
    "turn",
    "kittens",
    "worm",
    "potato",
    "sleep",
    "basket",
    "produce",
    "laborer",
    "ice",
    "root",
    "fold",
    "table",
    "dress",
    "battle",
    "lamp",
    "needle",
    "story",
    "rod",
    "cream",
    "death",
    "art",
    "prose",
    "sail",
    "receipt",
    "glove",
    "substance",
    "brass",
    "flower",
    "growth",
    "action",
];