import * as React from "react";
import { styled as muiStyled, Theme } from "@mui/material/styles";
import { isClient, isTest, Options, processSx, useTheme } from "../system";
import clsx from "clsx";

type StyleOptions<Props extends {}> = {
  theme: Theme;
  ownerState?: Props;
};

/**
 * Converts the processed style object into props and a style tag
 */
const convertToProps = <T extends Record<string, unknown>>({
  processedSx,
  inputProps,
}: {
  processedSx: ReturnType<typeof processSx>;
  inputProps: T;
}) => {
  const { sx, className, ...rest } = inputProps;

  const { cssString, cssClassName } = processedSx;

  const Props = {
    ...rest,
    className: clsx([className, cssClassName]) || undefined,
  } as unknown as T;

  const StyleInjector = Options.current().styleInjector;

  return {
    Props,
    StyleInjector: cssString ? (
      <StyleInjector
        headerStyles={String(cssString)}
        uniqueClassName={cssClassName!}
      />
    ) : undefined,
  };
};

/**
 * Wraps a component and processes the sx prop using {@link processSx}
 */
const serverStyled = <T extends React.ElementType>(
  ...params: [
    Component: T,
    options?: {
      name?: string;
      slot?: string;
      overridesResolver?: (props: any, styles: Record<string, any>) => string[];
    },
  ]
) => {
  const [Component] = params;

  return <Props extends {} = {}>(
    ...styledParams: [(options: StyleOptions<Props>) => React.CSSProperties]
  ) => {
    const [styleFn] = styledParams;

    // Call the default mui styled function with all arguments
    const ClientStyled =
      isClient() || isTest()
        ? (muiStyled as any)(...params)(...styledParams)
        : undefined;

    const Styled = React.forwardRef<
      HTMLElement,
      React.ComponentProps<T> & Props
    >((props, ref) => {
      if (isClient()) {
        return <ClientStyled {...props} ref={ref} />;
      }

      const { sx } = props;
      const theme = useTheme();

      const staticStyles = styleFn ? styleFn({ theme, ownerState: props }) : {};
      const processedSx = processSx(sx);
      const { StyleInjector, Props } = convertToProps({
        processedSx,
        inputProps: { ...props, style: { ...props.style, ...staticStyles } },
      });

      return (
        <>
          <Component {...(Props as any)} ref={ref} />
          {StyleInjector}
        </>
      );
    });

    return Styled;
  };
};

export const styled = serverStyled as unknown as typeof muiStyled;
