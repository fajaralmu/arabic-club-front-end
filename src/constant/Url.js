import { getAssetsPath } from "../middlewares/Common";
 
const rootValue =   document.getElementById("rootPath").value+"/";

export const contextPath = function(){
    const contextPath = rootValue;
    //console.debug("contextPath: ",contextPath,document.getElementById("rootPath").value);
    return contextPath;
}

// export const baseImageUrl() = contextPath()+"assets/images/"; 
// export const baseImageUrl() = "https://developmentmode.000webhostapp.com/uploaded_storage/"; 
// export const baseImageUrl() = "http://localhost/storage/images/"; 
export const baseImageUrl = () => getAssetsPath()+ "images/"; 
export const baseDocumentUrl = () => getAssetsPath()+ "documents/"; 
// export const baseImageUrl() = contextPath()+"WebAsset/Shop1/Images/"; 

export const POST = "post";
