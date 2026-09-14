import type { DemoTrack, LyricLine } from './playground.shared';

const MISSING_PERSON_LYRICS: readonly LyricLine[] = [
  { time: 0, text: '♪' },
  { time: 19.55, text: 'What do you see in the dark' },
  { time: 23.78, text: 'How far have you wandered' },
  { time: 28.91, text: 'Is your fear not a cause but a mark' },
  { time: 33.55, text: 'Of the years you have squandered' },
  { time: 38.79, text: "Do you feel you're all alone" },
  { time: 43.89, text: "Like you're lost without a home" },
  { time: 48.83, text: 'Were you ever here at all' },
  { time: 52.75, text: 'Or did you just fall' },
  { time: 58.41, text: 'You keep to yourself like you should' },
  { time: 63.97, text: 'While wishing and hoping' },
  { time: 68.63, text: "'Cause you think that you would if you could" },
  { time: 73.69, text: 'Come out into the open' },
  { time: 78.27, text: 'Do you feel like breaking out' },
  { time: 83.23, text: 'From a whisper to a shout' },
  { time: 88.29, text: 'Were you ever here at all' },
  { time: 92.39, text: 'Or did you just fall' },
  { time: 96.95, text: 'Did you just fall through it all' },
  { time: 102.49, text: 'Did you just fall' },
  { time: 107.63, text: "It's a lonely place inside" },
  { time: 111.21, text: 'When you feel you need to hide' },
  { time: 114.88, text: "When you're falling to the ground" },
  { time: 117.82, text: "And you're calling for help" },
  { time: 119.76, text: "But you can't make a sound" },
  { time: 122.41, text: 'And you think through grief and dread' },
  { time: 126.01, text: 'Through the screaming in your head' },
  { time: 129.38, text: 'That when all you see is red' },
  { time: 132.34, text: "It's 'cause you're already dead" },
  { time: 134.24, text: "You've always been dead" },
  { time: 137.01, text: "But I know that's just not true" },
  { time: 140.82, text: 'There is more to being you' },
  { time: 145.14, text: "Yes, it's hell to fall this deep" },
  { time: 148.2, text: "It's a nightmare, that's true" },
  { time: 150.34, text: 'But you can wake from this sleep' },
  { time: 153.52, text: 'When you wake up, the nightmare is gone' },
  { time: 158.58, text: "You won't know why you're crying" },
  { time: 164, text: 'Sunlight has brought a new dawn' },
  { time: 167.28, text: "And you're no longer dying" },
  { time: 173.08, text: 'There are horrors in the night' },
  { time: 178.57, text: 'That you feel too weak to fight' },
  { time: 183.43, text: 'But those beasts are trapped in you' },
  { time: 188.55, text: "And there's only so much" },
  { time: 190.9, text: 'A caged beast can do' },
  { time: 193.85, text: "There's only so much" },
  { time: 195.98, text: 'A poor beast can do' },
  { time: 202.31, text: 'Can you open the cage' },
  { time: 205.7, text: 'And let them fall through' },
  { time: 212, text: '♪' },
];

export const DEMO_TRACKS: readonly DemoTrack[] = [
  {
    id: 'hold-me-close',
    title: 'Hold Me Close',
    artist: 'RobbH feat. Zapac',
    src: '/songs/hold-me-close.m4a',
    duration: 217.94,
    cover: 0,
    downloaded: true,
    analysis: {
      start: 0.02,
      end: 217.78,
      fadeOut: 207.01,
      intro: { bpm: 124.809, downbeat: 1.453, confident: false },
      outro: { bpm: 126.002, downbeat: 142.952, confident: true },
      head:
        'b11c9193b92c97fdfqvvqplfbb57ledghfeajjhb2c82d98fkqqnkigdfd97djdkrtmkhjij' +
        'dgc72d9omwvsuzuxpmdfpplrztxrzswpoihckkgmwtrvrnukrgsbj8qpzvvljfnkhi48b627' +
        '8gbgvqqqlsgmkkgidkljqnnolnphnnjbc9fcitqqpmqgnjkghcohlrnmpjqmjonj9d9fcnjo' +
        'qjgojlrkpimqvqsaongfsjrp',
      tail:
        'cjedorszzvzptjjhnezzyzvzpkpkhnhhkamcesowurvprqkmivnzzpztnehpkgnggl9ncevp' +
        'vzyxprrljleovxqztwolmjinefm9lcfvpzvwztqzwhobtuwszwtonkhllgfidiciuozwqsqi' +
        'oehl9rjqqtrehojhojihdiednsqphjqifh5hk7qh9leneaokhn3hi5kc3g6gd9gh4cbbhech' +
        '77g6g22lc2k2gk4lc2j3jb30',
    },
  },
  {
    id: 'friend-to-friend',
    title: 'Friend to Friend',
    artist: 'Loyalty Freak Music',
    src: '/songs/friend-to-friend.m4a',
    duration: 163.46,
    cover: 1,
    downloaded: false,
    analysis: {
      start: 0,
      end: 162.47,
      fadeOut: 148.19,
      intro: { bpm: 129.995, downbeat: 0.963, confident: true },
      outro: { bpm: 130.006, downbeat: 90.046, confident: true },
      head:
        'l37k33j201510154i39i25h202500247g4bg28e10330033ad5dd1ac1042004fzumligggg' +
        'izxzoknwqlmh8kg7nzuzmfqxpjmiejgdozxznirwkemicjgcrzyymgrtnhdcc8cgtzvvhcuo' +
        'id9ab743vywugbtoidaa538mxxxtfcungb984336yvyrfdvslgeab9ejzvxqgiumhfecdb9g' +
        'zuxneksmheea99fqzvxlemrk',
      tail:
        'tkjvieyzxzliwumvpeqqivyxzvlwwsqopvhlqnyzxtqoxwsuopkpquyyyuqvxtiprslpdqzz' +
        'ytirxultkmvrkuzxzsluwrpvllkotvzyyqrwxssqqqmmquzzxprvyrjrnjtnetzxzoitwnst' +
        'fmsjsyzxxmtxtqortjnonwzyvpowpjfed99ab99889a98a89aaba89aca888889aa99b7a98' +
        'a7898889a98998888a720000',
    },
  },
  {
    id: 'sweet-you',
    title: 'Sweet You',
    artist: 'Loyalty Freak Music',
    src: '/songs/sweet-you.m4a',
    duration: 160.0,
    cover: 2,
    downloaded: false,
    analysis: {
      start: 0,
      end: 160,
      fadeOut: null,
      intro: { bpm: 119.942, downbeat: 0.022, confident: true },
      outro: { bpm: 119.982, downbeat: 85.038, confident: true },
      head:
        'tohc857jupfa76544omb523arxwtj98mrglonh7687tskb77655csj6434ltxwmb7eokdupe' +
        '8qoknzoga7aq86ungaiommxrmc8at86pojdfpqkyvurfntwzxqlg9twuuymjomyqvvusjawt' +
        'fouke98cryzxoa653etzwsisytxzzrkemwmfwnic87rszzre8544ruuwmqszquztwzqwxrxt' +
        'mjfhorwzwqmnnnmrywrirysx',
      tail:
        'ppvtmqvkigbcsyzzmd553cryuujsxusyztzpsztsxpmihjtsyztronpmrzxwmptyryzwonqw' +
        'smuulgfefsxzxlb653fsxutlrytuzwqngkrshxula76788hnocbtohuvoeb99a7bsod9tnjr' +
        'yurjgoxzssnfanqsvvpkmmwvrvtlhckoqkysj965666iljccqoettkb87665dnka8umbruom' +
        'bekvwopi85mjfltgab9dabb7',
    },
  },
  {
    id: 'walking-shoes',
    title: 'Walking Shoes',
    artist: 'Loyalty Freak Music',
    src: '/songs/walking-shoes.m4a',
    duration: 167.15,
    cover: 3,
    downloaded: false,
    analysis: {
      start: 0,
      end: 165.6,
      fadeOut: 159.73,
      intro: { bpm: 86.674, downbeat: 1.423, confident: true },
      outro: { bpm: 86.667, downbeat: 94.191, confident: true },
      head:
        'wnejhgqnxupomljihjxojllkklznheba987cwldkgippwspnmkjihnvnimkkjqwmfdba987l' +
        'umjljjlsvxtomomigtuqospqoszzzzwtomlvtjrqkptxzulnjunqvzyvoliqjvzzzzthppky' +
        'sjnjemkxxssqmklkiztnrrorlyzvvwxwsokzrjtrjtnzunslutsmwztmoilprwzyvqmmsoty' +
        'ojqmlorvrllmjjkhsxplokhf',
      tail:
        'qnozuptnksqxwuuqmbrrqzpkvtinmwwpljgfechzqlqonqrwztpmjjhfkvmkvqnqswwsqnlk' +
        'hetwolojllsvwroljifdszsptpjnvxvsoljjfexrklifnjuyvqnlihgewuooplolvwsrmkjg' +
        'eeyokromplxwqmjhfedaztltqgnmxvqkhgecbeypjlhfjitvojgedbacsjelhdggmieca876' +
        '5bf99b876799532211000000',
    },
  },
  {
    id: 'missing-person',
    title: 'Missing Person',
    artist: 'JeffSpeed68 feat. orrisroot',
    src: '/songs/missing-person.m4a',
    duration: 219.05,
    cover: 4,
    downloaded: true,
    lyrics: MISSING_PERSON_LYRICS,
    lyricist: 'orrisroot',
    analysis: {
      start: 0.16,
      end: 215.85,
      fadeOut: null,
      intro: { bpm: 97.063, downbeat: 0.309, confident: true },
      outro: { bpm: 96.81, downbeat: 144.969, confident: false },
      head:
        '2if9debbeedikfba8bdc9bdkeda89dgjfieaaddbaaaepgcce9fgjcebcegcceefgfefcihc' +
        'dfdgffheeecdectqgpomshuuozwspqqimoihsnqrtwwyzvqrpnnnptpofsmmsmtjlzouwroo' +
        'rtilxoruwyvkwzzzopmkhjkijtooypotuurryqqkeeghijojlypjquqqwqrtnllmorqnqquv' +
        'lrxlstusqljimsnmntnktvvw',
      tail:
        'ggisxuwslxvuzoqpzvqsytpsqpuzutyvuvmornomktkhhnruzuvytqvxrnmzxruvytusnptp' +
        'lyzzqipizzwxzwrvpjjxpqvrqqgwzzzztrllhqzmyvkivwsmimkwsppvvsrquooxlqtpijic' +
        'tzzyywzwuvlprllmmmlljjiijlzcxqsqlnrkfg54mpvzzruzzrvn638ntzzzzujhknjddefh' +
        'hhhhhfc85200000000000000',
    },
  },
];
