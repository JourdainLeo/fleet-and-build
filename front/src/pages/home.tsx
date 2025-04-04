import { Flex, Image, Text } from "@mantine/core";

const Home = () => {
  return (
    <Flex
      align={"center"}
      justify={"center"}
      flex={1}
      h={"100%"}
      direction={"column"}
      gap={64}
    >
      <Image src={"/public/fab-icon.png"} h={200} w={"auto"}></Image>
      <Text fz={48} style={{ textAlign: "center" }}>
        Welcome to your Flesh and Blood
        <br /> collection manager!
      </Text>
    </Flex>
  );
};

export default Home;
