import { Fusion, Hero, Rarity, Release, Type } from "@flesh-and-blood/types";
import type { SelectProps } from "@mantine/core";
import {
  Flex,
  Image,
  Select as MantineSelect,
  Modal,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconBoxMultipleFilled,
  IconFlameFilled,
  IconStarFilled,
  IconTagFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import React from "react";
import { Action } from "../../components/Action";
import CompareInput from "../../components/CompareInput";
import { useZustore } from "../../services/zustore";

const sets = Object.values(Release).filter(
  (value) =>
    !value.toLowerCase().includes("deck") &&
    !value.toLowerCase().includes("1st strike"),
);

const heroes = Object.values(Hero);
const rarities = Object.values(Rarity);
const fusions = Object.values(Fusion);
const types = Object.values(Type);

function FilterModal({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1040px)");
  const hero = useZustore((state) => state.hero);
  const set = useZustore((state) => state.set);
  const type = useZustore((state) => state.type);
  const rarity = useZustore((state) => state.rarity);
  const fusion = useZustore((state) => state.fusion);
  const artist = useZustore((state) => state.artist);
  const setFilter = useZustore((state) => state.setFilter);
  const pitch = useZustore((state) => state.pitch);
  const attack = useZustore((state) => state.attack);
  const defense = useZustore((state) => state.defense);
  const cost = useZustore((state) => state.cost);
  const pitchOperator = useZustore((state) => state.pitch_operator);
  const attackOperator = useZustore((state) => state.attack_operator);
  const defenseOperator = useZustore((state) => state.defense_operator);
  const costOperator = useZustore((state) => state.cost_operator);

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Filter cards"
      centered
      radius={16}
      size={isMobile ? "100%" : isTablet ? "100%" : "80%"}
    >
      <Flex direction={"column"} gap={16} p={16} pb={0}>
        <Flex gap={16} direction={isMobile ? "column" : "row"}>
          <Select
            label={
              <Flex align={"center"} gap={4}>
                <Image src={"hp.png"} w={14} h={14} />
                <Text fz={14}>Hero</Text>
              </Flex>
            }
            data={heroes}
            value={hero ?? null}
            onChange={(value) => setFilter("hero", value ?? undefined)}
          />
          <Select
            label={
              <Flex align={"center"} gap={4}>
                <IconBoxMultipleFilled size={14} />
                <Text fz={14}>Set</Text>
              </Flex>
            }
            data={sets}
            value={set ?? null}
            onChange={(value) => setFilter("set", value ?? undefined)}
          />
          <Select
            label={
              <Flex align={"center"} gap={4}>
                <IconTagFilled size={14} />
                <Text fz={14}>Type</Text>
              </Flex>
            }
            data={types}
            value={type ?? null}
            onChange={(value) => setFilter("type", value ?? undefined)}
          />
        </Flex>
        <Flex gap={16} direction={isMobile ? "column" : "row"}>
          <Select
            label={
              <Flex align={"center"} gap={4}>
                <IconStarFilled size={14} />
                <Text fz={14}>Rarity</Text>
              </Flex>
            }
            data={rarities}
            value={rarity ?? null}
            onChange={(value) => setFilter("rarity", value ?? undefined)}
          />
          <Select
            label={
              <Flex align={"center"} gap={4}>
                <IconFlameFilled size={14} />
                <Text fz={14}>Fusion</Text>
              </Flex>
            }
            data={fusions}
            value={fusion ?? null}
            onChange={(value) => setFilter("fusion", value ?? undefined)}
          />
          <Select
            label={
              <Flex align={"center"} gap={4}>
                <IconUserFilled size={14} />
                <Text fz={14}>Artist</Text>
              </Flex>
            }
            data={artists}
            value={artist ?? null}
            onChange={(value) => setFilter("artist", value ?? undefined)}
          />
        </Flex>
        <Flex gap={16} direction={isMobile ? "column" : "row"}>
          <CompareInput
            pitch
            value={pitch}
            label={"Pitch"}
            k={"pitch"}
            operatorValue={pitchOperator}
            icon={"pitch.png"}
            operator={"pitch_operator"}
          />

          <CompareInput
            value={cost}
            label={"Cost"}
            k={"cost"}
            operatorValue={costOperator}
            icon={"pitch.png"}
            operator={"cost_operator"}
          />
        </Flex>
        <Flex gap={16} direction={isMobile ? "column" : "row"}>
          <CompareInput
            value={attack}
            label={"Attack"}
            k={"attack"}
            operatorValue={attackOperator}
            icon={"attack.png"}
            operator={"attack_operator"}
          />

          <CompareInput
            value={defense}
            label={"Defense"}
            k={"defense"}
            operatorValue={defenseOperator}
            icon={"def.png"}
            operator={"defense_operator"}
          />
        </Flex>
        <Flex justify={"flex-end"} gap={16}>
          <Action
            label={"Clear all"}
            onClick={() => {
              setFilter("hero", undefined);
              setFilter("set", undefined);
              setFilter("type", undefined);
              setFilter("rarity", undefined);
              setFilter("fusion", undefined);
              setFilter("artist", undefined);
              setFilter("pitch", undefined);
              setFilter("defense", undefined);
              setFilter("attack", undefined);
              setFilter("cost", undefined);
            }}
          />
          <Action label={"Close"} onClick={close} />
        </Flex>
      </Flex>
    </Modal>
  );
}

const Select = React.memo(({ label, data, value, onChange }: SelectProps) => {
  const l = typeof label === "string" ? label.toLowerCase() : "";
  return (
    <MantineSelect
      flex={1}
      label={label}
      placeholder={"Pick " + l}
      data={data}
      value={value}
      clearable
      onChange={onChange}
    />
  );
});

const artists = [
  "AOJI Maiko",
  "Adolfo Navarro",
  "Agri Karuniawan",
  "Agus Setiawan",
  "Akifa Shahgeldleva",
  "Aleksey Peregudov",
  "Alena Marchenko",
  "Alexander Gering",
  "Alexander Mokhov",
  "Alexander Nikolaev",
  "Alexander Pachin",
  "Alexander Staronosov",
  "Alexandra Malygina",
  "Alexey Peregrudov",
  "Alexis Susani",
  "Alief Rusdiatama",
  "Alifka Hammam Nugroho",
  "Alsu Nurieva",
  "Aluísio Cervelle",
  "Ambang Tegar Prakoso",
  "Amelia Tan",
  "Anastasia Alexandrova",
  "Anastasia Balakchina",
  "Anastasia Chernaya",
  "Anastasia Pronina",
  "Anastasiya Grintsova",
  "Andi Cahyo W",
  "Andrew Chou",
  "Andrey Savchuk",
  "Andy Aslamov",
  "Angelina Tyshchik",
  "Anna Kharitonova",
  "Anna Tanygina",
  "Anton Bezrukov",
  "Arghawana Rim",
  "Arif Wijaya",
  "Artur Treffner",
  "Asep Ariyanto",
  "Askapoj T",
  "Asur Misoa",
  "Athiwut B.",
  "Audy Ravindra",
  "Ausonia",
  "BWusagi",
  "Bastien Jez",
  "Billy Christian",
  "Bramasta Aji",
  "Brian Adriel",
  "Brian Madya Narendra",
  "CGlas",
  "Camille Alquier",
  "Carlos Cruchaga",
  "Carlos Jose Camus",
  "Chris Cold",
  "Cindy Handoyo",
  "Cristián Huerta",
  "Daken",
  "Daniel Jiménez",
  "Daniil Goncharov",
  "Daria Cherkashina",
  "Daria Khlebnikova",
  "David Ogilvie",
  "Dmitriy Semyonov",
  "Dmitry Isakevitch",
  "Dmitry Solodovnikov",
  "Dominik Mayer",
  "Edward Chee",
  "Eilene Cherie",
  "Ekaterina Revazashvili",
  "Elena Bakulina",
  "Elena Danilova",
  "Elena Perelygina",
  "Eleonor Piteira",
  "Elina Akhiamova",
  "Elizaveta Alipatova",
  "Elizaveta Zaichikova",
  "Emanuel Dias",
  "Emilis Emka",
  "Enmoire",
  "Eric Klug",
  "Erick Efata",
  "Esty Swandana",
  "Faizal Fikri",
  "Fajareka Setiawan",
  "Federico Musetti",
  "Fedor Barkhatov",
  "Felicia Liang",
  "Firaz M. Rasyid",
  "Flora Silve",
  "Galih M",
  "Gorshkov Stanislav",
  "Grant Griffin",
  "Grigoriy Parshakov",
  "Grégory Nunkovics",
  "Hatori Kyoka",
  "Hendry Iwanaga",
  "Henrique Lindner",
  "Henry Leung",
  "Hilary Purnamasari",
  "Hoàng Lập",
  "Iain Miki",
  "Igor Heras",
  "Immanuela Crovius",
  "Ina Wong",
  "Inkognit",
  "Irene Francisco",
  "Irina Kononenko",
  "Irina Plotnikova",
  "Irina Si",
  "Ironical Ghosty",
  "Ismatulloh",
  "Isuardi Therianto",
  "J. Sebastián S.C.",
  "Jason Kiantoro",
  "Jefrey Yonathan",
  "Jen Santos",
  "Jessada Sutthi",
  "Jessica Nguyen",
  "Jessketchin",
  "Joseph Qiu",
  "Joshua Raphael",
  "Jsraphael",
  "Junaidi Lim",
  "Kalashnikova N.",
  "Kanadekana",
  "Kate Fox",
  "Kelvin Jauwri",
  "Kevin Sidharta",
  "Kimberly Pantoni",
  "King Fung Ng",
  "Ksenia Belova",
  "Kyxarie Peralta",
  "Le Vuong",
  "Leo Avero",
  "Leony Tobing",
  "Lius Lasahido",
  "Livia Prima",
  "Lizhe Liang",
  "M Fakhrur Rozzi",
  "MJ Fetesio",
  "Mace Tan",
  "Madeline Boni",
  "Maerel Hibadita",
  "Marcellino Tan",
  "Marco González",
  "Marco Wulfr",
  "Marcus Reyno",
  "Maria Mishina",
  "Marina Lunina",
  "Mario Wibisono",
  "Mariusz Gandzel",
  "Mark Poole",
  "Masha Mishina",
  "Mateus Manhanini",
  "Mateusz Wiśniewski",
  "Max Kostin",
  "Maxim Nikiforov",
  "Michal Makowski",
  "Mihail Spil-Haufter",
  "Mike Dalzell",
  "Mikhail Babkin",
  "Milena Vasyukova",
  "Milivoj Ćeran",
  "Muhammad Fajri",
  "Murilo Amgarten",
  "Nailsen Ivanderlie",
  "Narendra B Adi",
  "Nathaniel Himawan",
  "Nikita Bondarev",
  "Nikko Wahyudi",
  "Nikolai Maslakov",
  "Nikolay Moskvin",
  "Nuttapong Thanawiwitaporn",
  "Olga Khariton",
  "Olga Krivolapova",
  "Olga Tereshenko",
  "Oliver Morit",
  "Orson CaptainSass",
  "Othon Nikolaidis",
  "Oxana Turlay",
  "Pabel Rtishchev (Klaher)",
  "Panji Bagus P",
  "Pascal Quidault",
  "Patchanee Treedet",
  "Pavel Chuvin",
  "Pavel Kondrashov",
  "Pavel Rtishchev (Klaher)",
  "Petrinda Wiyugo",
  "Peyeyo",
  "Phu Thieu",
  "Prisca Ardiana",
  "Rachel Alderson",
  "Ramza Ardyputra",
  "Raphael Masalimov",
  "Raphael Pinna",
  "Regina Krivolapova",
  "Revazashvili E.",
  "Reza Afshar",
  "Richard Elrassi",
  "Rio Sabda",
  "Riordan Delmiro",
  "Rodrigo Rizo",
  "Saad Irfan",
  "Sam Yang",
  "Samuel Perin",
  "SanSan",
  "Sandeep Karunakaran",
  "Sariya Asavametha",
  "Satriasa",
  "Sebastian Giacobino",
  "Sebastian Szmyd",
  "Septimius Ferdian",
  "Sergey Averkin",
  "Sergey Gurskiy",
  "Shen Fei",
  "Shiro Yayoi",
  "Silvia Meiliani",
  "Simon Dominic",
  "Simon Wong",
  "Sofia Akimova",
  "Sonia Sandoval",
  "Sooraj Babu",
  "Stanislav Sherbakov",
  "Steve Argyle",
  "Stormy Elia Fanggidae",
  "Surya P",
  "Surya Prasteya",
  "Tanapon Wachirakul",
  "Tatiana Trubnikova",
  "Thomas Ressuge",
  "Tian Thongjomroon",
  "Todor Hristov",
  "Tomasz Jedruszek",
  "Tommy Suhartono",
  "Trung Tin Shinji",
  "Vadim Kalabukh",
  "Vathan Suwannaworn",
  "Vera Rudichenko",
  "Veto Zomer",
  "Victoria Belyaeva",
  "Viktoria Belyaeva",
  "Vito Febrianno",
  "Vito Vivodka",
  "Vlad Tashkinov",
  "Vlad Varlamov",
  "Vladimir Shatunov",
  "Widya Wang",
  "Wisnu Tan",
  "Wírawan Pranoto",
  "YDZ",
  "Yen Lee",
  "Yeong-Hao Han",
  "Yolanda Felicia",
  "Yugin Maffioli",
  "Yulia Litvinova",
  "Yulia Tarushko",
  "bimawithpencil",
  "romiy",
  "soyameii",
  "寿多浩 (Hiro Suda)",
];

export default FilterModal;
