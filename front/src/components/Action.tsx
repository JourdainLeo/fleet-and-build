import type {
  ButtonVariant,
  MantineColor,
  MantineGradient,
  MantineSize,
  MantineStyleProp,
} from "@mantine/core";
import { ActionIcon, Button } from "@mantine/core";
import React from "react";
import { useApi } from "../services/api";
import type { IServices } from "../services/model";
import { useStore } from "../services/store";

interface IAction {
  className?: string;
  style?: MantineStyleProp;
  onClick?: (k: IServices) => void;
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
  const store = useStore();

  const p = {
    ...props,
    onClick: () => {
      if (props.onClick) {
        props.onClick({ api, store });
      }
    },
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
        <Button radius={16} {...p}>
          {props.label}
        </Button>
      ) : (
        <ActionIcon radius={16} {...p}>
          {props.icon}
        </ActionIcon>
      )}
    </>
  );
};
