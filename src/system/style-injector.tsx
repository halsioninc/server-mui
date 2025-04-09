import { supportsHeaderStyles } from "./environment";

/**
 * A component to add style tags to the document.
 * This is necessary because while most styles can be inlined, media query
 * styles cannot be inlined and require a <style> tag
 */
export const DefaultStyleInjector = ({
  headerStyles,
  uniqueClassName,
}: {
  headerStyles: string;
  uniqueClassName: string;
}) => {
  if (supportsHeaderStyles()) {
    return (
      <style href={uniqueClassName} precedence="low">
        {headerStyles}
      </style>
    );
  } else {
    return <style>{headerStyles}</style>;
  }
};
