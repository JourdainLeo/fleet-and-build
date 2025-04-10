import type {
  ButtonVariant,
  MantineColor,
  MantineGradient,
  MantineSize,
  MantineStyleProp,
} from "@mantine/core";
import { ActionIcon, Button } from "@mantine/core";
import type { MouseEvent } from "react";
import React from "react";
import { useApi } from "../services/api";
import type { IServices } from "../services/model";

interface IAction {
  className?: string;
  style?: MantineStyleProp;
  onClick?: (
    k: IServices,
    event: MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  label?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  radius?: string;
  gradient?: MantineGradient;
  disabled?: boolean;
  color?: MantineColor;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  size?: MantineSize | string;
  variant?: ButtonVariant;
  disabledClassName?: string;
}

export const Action = (props: IAction) => {
  const api = useApi();

  const p = {
    ...props,
    onClick: (event: any) => {
      if (props.onClick) {
        props.onClick({ api }, event);
      }
    },
    leftSection: props.icon,
    className:
      props.className && props.disabled
        ? props.disabledClassName
          ? props.disabledClassName
          : ""
        : props.className,
  };

  return (
    <>
      {props.label ? (
        <Button {...p}>{props.label}</Button>
      ) : (
        <ActionIcon size={"lg"} {...p}>
          {props.icon}
        </ActionIcon>
      )}
    </>
  );
};
