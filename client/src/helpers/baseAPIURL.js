import appMode from "./appMode";

let baseAPIURL = appMode === "1" ? "http://localhost:8080"  : "http://localhost:8000"

export default baseAPIURL;