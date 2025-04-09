import type { MantineSize } from "@mantine/core";
import { Image, Skeleton } from "@mantine/core";
import Tilt from "react-parallax-tilt";

function TiltCard({
  url,
  imageLoading,
  setImageLoading,
  hiddenFrom,
  visibleFrom,
}: {
  url: string | undefined;
  imageLoading: boolean;
  setImageLoading: (loading: boolean) => void;
  hiddenFrom?: MantineSize | (string & {}) | undefined;
  visibleFrom?: MantineSize | (string & {}) | undefined;
}) {
  return (
    <Skeleton
      visible={imageLoading}
      animate
      h={500}
      w={358}
      radius="md"
      mt={16}
      hiddenFrom={hiddenFrom}
      visibleFrom={visibleFrom}
    >
      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.2}
        glareColor="#ffffff"
        glarePosition="all"
        glareBorderRadius={"20px"}
        scale={1}
        transitionSpeed={200}
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        className="cursor"
      >
        <Image
          src={url}
          fit="contain"
          height={500}
          width={358}
          radius="md"
          onLoad={() => setImageLoading(false)}
          loading="lazy"
        />
      </Tilt>
    </Skeleton>
  );
}

export default TiltCard;
