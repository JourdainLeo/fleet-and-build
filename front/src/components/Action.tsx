import type {
    MantineStyleProp,
    MantineGradient,
    MantineColor,
    MantineSize,
    ButtonVariant} from "@mantine/core";
import {
    ActionIcon,
    Button
} from "@mantine/core";
import type { IServices } from "../services/model";
import { useStore } from "../services/store";
import { useApi } from "../services/api";
import React from "react";

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
                <Button {...p}>{props.label}</Button>
            ) : (
                <ActionIcon {...p}>{props.icon}</ActionIcon>
            )}
        </>
    );
};
