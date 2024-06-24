import { Button } from "@mui/material";

let width = "25"
let height = "25"
let widthPX = "25px"
let heightPX = "25px"

export default function BotonIniciar({ onClick,disabled }) {

    return (
        <Button
        onClick={onClick}
        disabled={disabled}
        style={{
          padding: 0,
          minWidth: widthPX,
          minHeight: heightPX,
          width: widthPX,
          height: heightPX,
          borderRadius: '10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 42 42" fill="none">
          <rect width="42" height="42" rx="10" fill="#5FA845" />
          <path fillRule="evenodd" clipRule="evenodd" d="M15.88 10.3286C15.3346 9.95522 14.6048 9.89516 13.995 10.1735C13.3852 10.4517 13 11.0206 13 11.6429V31.3571C13 31.9794 13.3852 32.5483 13.995 32.8265C14.6048 33.1048 15.3346 33.0448 15.88 32.6714L30.28 22.8143C30.7332 22.504 31 22.0171 31 21.5C31 20.9829 30.7332 20.496 30.28 20.1857L15.88 10.3286Z" fill="#F7FBF7" />
        </svg>
      </Button>


    )

}
