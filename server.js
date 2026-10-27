const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const FEEDBACK_FILE = path.join(ROOT, "data", "feedback.json");
const mimeTypes = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"application/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".svg":"image/svg+xml"};

function send(res,status,content,type="text/plain; charset=utf-8"){res.writeHead(status,{"Content-Type":type,"X-Content-Type-Options":"nosniff"});res.end(content)}
function readBody(req){return new Promise((resolve,reject)=>{let body="";req.on("data",chunk=>{body+=chunk;if(body.length>1e6){reject(new Error("Payload too large"));req.destroy()}});req.on("end",()=>resolve(body));req.on("error",reject)})}
const server = http.createServer(async(req,res)=>{
 const url = new URL(req.url,`http://${req.headers.host||"localhost"}`);
 if(req.method==="POST"&&url.pathname==="/api/feedback"){
  try{
   const data=JSON.parse(await readBody(req));
   const name=String(data.name||"").trim(),email=String(data.email||"").trim(),message=String(data.message||"").trim();
   if(!name||name.length>100||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>160||message.length<10||message.length>2000){
    return send(res,400,JSON.stringify({error:"Please provide a valid name, email and feedback message."}),"application/json; charset=utf-8");
   }
   let entries=[];
   try{entries=JSON.parse(fs.readFileSync(FEEDBACK_FILE,"utf8"))}catch{}
   entries.push({name,email,message,submittedAt:new Date().toISOString()});
   fs.writeFileSync(FEEDBACK_FILE,JSON.stringify(entries,null,2));
   return send(res,201,JSON.stringify({message:"Feedback saved successfully."}),"application/json; charset=utf-8");
  }catch{return send(res,400,JSON.stringify({error:"Invalid request body."}),"application/json; charset=utf-8")}
 }
 if(req.method!=="GET"&&req.method!=="HEAD")return send(res,405,"Method not allowed");
 let pathname=decodeURIComponent(url.pathname);
 if(pathname==="/")pathname="/index.html";
 const target=path.resolve(ROOT,"."+pathname);
 if(!target.startsWith(ROOT+path.sep))return send(res,403,"Forbidden");
 fs.readFile(target,(err,data)=>{
  if(err)return send(res,404,"404 — Page not found. Return to Hidden India at /.");
  const type=mimeTypes[path.extname(target).toLowerCase()]||"application/octet-stream";
  res.writeHead(200,{"Content-Type":type,"X-Content-Type-Options":"nosniff"});
  if(req.method==="HEAD")return res.end();
  res.end(data);
 });
});
server.listen(PORT, "0.0.0.0", ()=>console.log(`Hidden India is running on port ${PORT}`));
