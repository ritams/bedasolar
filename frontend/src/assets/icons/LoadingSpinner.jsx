export default function LoadingSpinner({ size = 16, className = "", ...props }) {
  return (
    <div 
      className={`loading-spinner ${className}`}
      style={{ 
        width: size, 
        height: size,
        ...props.style 
      }}
      {...props}
    />
  );
} 