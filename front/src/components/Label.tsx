import { Flex, Text } from "@mantine/core";

function Label({
  text,
  withAsterisk,
  icon,
}: {
  text: string;
  withAsterisk?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Flex align={"center"} gap={4}>
      {icon}
      <Text fz={14}>
        {text}{" "}
        {withAsterisk && (
          <Text span c="red" ml={4}>
            *
          </Text>
        )}
      </Text>
    </Flex>
  );
}

export default Label;
