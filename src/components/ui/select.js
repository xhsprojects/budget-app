export const Select = ({ children, ...props }) => <select {...props}>{children}</select>;
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectItem = ({ children, ...props }) => <option {...props}>{children}</option>;
export const SelectTrigger = ({ children }) => <>{children}</>;
export const SelectValue = ({ children }) => <>{children}</>;