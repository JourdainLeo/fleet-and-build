import { Fusion, Hero, Rarity, Release, Type } from "@flesh-and-blood/types";
import type { SelectProps } from "@mantine/core";
import { Flex, Select as MantineSelect, Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
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
      size={isMobile ? "100%" : isTablet ? "100%" : "80%"}
    >
      <Flex direction={"column"} gap={16} p={16}>
        <Flex gap={16}>
          <Select
            label="Hero"
            data={heroes}
            value={hero}
            onChange={(value) => setFilter("hero", value ?? undefined)}
          />
          <Select
            label="Set"
            data={sets}
            value={set}
            onChange={(value) => setFilter("set", value ?? undefined)}
          />
          <Select
            label="Type"
            data={types}
            value={type}
            onChange={(value) => setFilter("type", value ?? undefined)}
          />
        </Flex>
        <Flex gap={16}>
          <Select
            label="Rarities"
            data={rarities}
            value={rarity}
            onChange={(value) => setFilter("rarity", value ?? undefined)}
          />
          <Select
            label="Fusion"
            data={fusions}
            value={fusion}
            onChange={(value) => setFilter("fusion", value ?? undefined)}
          />
          <Select
            label="Artist"
            data={["artist1", "artist2", "artist3"]}
            value={artist}
            onChange={(value) => setFilter("artist", value ?? undefined)}
          />
        </Flex>
        <Flex gap={16} wrap="wrap">
          <CompareInput
            pitch={pitch}
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
      </Flex>
    </Modal>
  );
}

const Select = React.memo(({ label, data, value, onChange }: SelectProps) => (
  <MantineSelect
    flex={1}
    label={label}
    placeholder="Pick value"
    data={data}
    value={value}
    onChange={onChange}
  />
));

export default FilterModal;
