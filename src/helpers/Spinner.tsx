export default function Spinner({size, mainColor, sideColor, margins, borderSize}: any) {
    const styleObject = {
        width: `${size ?? "24px"}`,
        height: `${size ?? "24px"}`,                        
        animation: 'spin 1s linear infinite',        
        border: `${borderSize ?? "4px"} solid ${mainColor ?? "rgb(90, 210, 216)"}`,
        borderTop: `${borderSize ?? "4px"} solid ${sideColor ?? "#7a19e9"}`,
        borderRadius: '50%',        
        margin: `${margins} ?? 10px 5px 0px`,
    };

  return (
    <div 
        style={styleObject}
    />
  );
};