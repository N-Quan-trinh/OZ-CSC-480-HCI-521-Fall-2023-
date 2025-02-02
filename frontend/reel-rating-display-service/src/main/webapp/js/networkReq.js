export const fetchPost = async(url, jsonData, callbackFunc)=>{
    await fetch(url,{
        mode : "cors",
        method : "post",
        headers:{
            "Content-Type" : "application/json",
        },
        body : jsonData,
        credentials: "include"
    })
    .then(async(serverData)=>{
        callbackFunc(serverData);
    });   
}


export const fetchGet = async (url, callbackFunc)=>{
    await fetch(url,{
        mode : "cors",
        method : "get",
        credentials: "include"
    })
    .then(async(serverData)=>{
        callbackFunc(serverData);
    }); 
}