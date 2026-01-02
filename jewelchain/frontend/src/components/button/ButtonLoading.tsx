import { Fragment } from "react";

interface ButtonLoadingProps {
  isLoading: boolean;
  label: string;
  handelerClick?: () => void;
}
export const ButtonLoading = ({
  handelerClick,
  label,
  isLoading,
}: ButtonLoadingProps) => {
  return (
    <button
      className="btn btn-primary"
      onClick={handelerClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner"></span>
          {label}...
        </>
      ) : (
        <Fragment>{label}</Fragment>
      )}
    </button>
  );
};
