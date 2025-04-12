import { Flex, Image, Modal, TextInput } from "@mantine/core";
import { IconDeviceGamepad, IconInputX } from "@tabler/icons-react";
import { useState } from "react";
import { Action } from "../../components/Action";
import { heroes, Select } from "../../components/filter/FilterModal";
import Label from "../../components/Label";
import { useZustore } from "../../services/zustore";

function DeckCreate({ opened, close }: { opened: boolean; close: () => void }) {
  const [hero, setHero] = useState("");
  const [name, setName] = useState("");
  const [format, setFormat] = useState<"Blitz" | "Classic Constructed">(
    "Blitz",
  );
  const setDecks = useZustore((state) => state.setDecks);

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      radius={16}
      title={"Create Deck"}
    >
      <Flex direction={"column"} gap={16}>
        <TextInput
          placeholder={"Deck Name"}
          maxLength={24}
          label={
            <Label
              text={"Name"}
              withAsterisk
              icon={<IconInputX width={14} height={14} />}
            />
          }
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Select
          label={
            <Label
              text={"Hero"}
              withAsterisk
              icon={<Image src={"hp.png"} w={14} h={14} />}
            />
          }
          data={heroes}
          value={hero}
          onChange={(v) => {
            setHero(v ?? "");
          }}
        />
        <Select
          label={
            <Label
              text={"Format"}
              icon={<IconDeviceGamepad width={14} height={14} />}
            />
          }
          data={["Blitz", "Classic Constructed"]}
          defaultValue={"Blitz"}
          value={format}
          onChange={(v) => {
            setFormat((v as any) ?? "Blitz");
          }}
        />

        <Flex justify={"flex-end"}>
          <Action
            label={"create"}
            disabled={!name || !hero}
            onClick={async ({ api }) => {
              await api.post(
                "/user/:id/deck",
                { id: 1 },
                {
                  name: name,
                  hero: hero,
                  type: format,
                },
                (json) => {
                  setDecks(json.results);
                  close();
                  setName("");
                  setHero("");
                  setFormat("Blitz");
                },
              );
            }}
          />
        </Flex>
      </Flex>
    </Modal>
  );
}

export default DeckCreate;
