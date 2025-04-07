import { Flex, Image, NumberInput, Select, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import { useZustore } from "../services/zustore";

export interface CompareInputProps {
  label: string;
  k: "pitch" | "cost" | "attack" | "defense";
  operator:
    | "cost_operator"
    | "attack_operator"
    | "defense_operator"
    | "pitch_operator";
  pitch?: boolean;
  icon?: string;
  value?: number | string;
  operatorValue?: string;
}

const CompareInput = React.memo(
  ({
    label,
    k,
    operator,
    pitch,
    icon,
    value,
    operatorValue,
  }: CompareInputProps) => {
    const setFilter = useZustore((state) => state.setFilter);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isTablet = useMediaQuery("(max-width: 1040px)");

    return (
      <Flex
        style={{
          flex: isMobile || isTablet ? "1 0 45%" : "1 0 22%",
          minWidth: isMobile || isTablet ? "45%" : "22%",
        }}
      >
        <Flex justify={"center"} direction={"column"} flex={1}>
          <Flex align={"center"} gap={4}>
            <Image src={icon} w={14} h={14} />
            <Text fz={14}>{label ?? ""}</Text>
          </Flex>
          <Flex align={"center"} justify={"center"} flex={1}>
            <Select
              flex={1}
              defaultValue={"="}
              data={["=", ">", "<", ">=", "<="]}
              value={operatorValue}
              onChange={(value) => {
                if ([">", "<", ">=", "<=", "="].includes(value ?? "=")) {
                  setFilter(operator, (value as any) ?? "=");
                }
              }}
            />

            {pitch ? (
              <Select
                data={["Red (1)", "Yellow (2)", "Blue (3)"]}
                placeholder="Pick value"
                flex={2}
                clearable
                value={
                  Number(value) === 1
                    ? "Red (1)"
                    : Number(value) === 2
                      ? "Yellow (2)"
                      : Number(value) === 3
                        ? "Blue (3)"
                        : null
                }
                onChange={(v) => {
                  const val =
                    v === "Red (1)"
                      ? 1
                      : v === "Yellow (2)"
                        ? 2
                        : v === "Blue (3)"
                          ? 3
                          : undefined;

                  setFilter("pitch", val);
                }}
              />
            ) : (
              <NumberInput
                min={0}
                flex={2}
                placeholder="Pick pitch"
                value={value}
                onChange={(v) => {
                  setFilter(k, Number(v));
                }}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    );
  },
);

export default CompareInput;
