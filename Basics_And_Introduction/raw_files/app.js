const http = require('http');
const fs = require('fs');
// Method 1
// function rqListener(req, res){
// }
// http.createServer(rqListener);
// Basically telling create server to execute reListener for every request it gets
const server = http.createServer((req, res) => {
    // console.log(req.url, req.method, req.headers);
    const url = req.url;
    const method = req.method;
    if (url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action = "/message" method="POST"><input type = "text" name="message"><button type = "Submit"> Send </button></form></body>'); 
        // Automatically the form sends us the filled input via the name "message" so the name can be really anything
        res.write('</html>');
        // This return is necessary to not execute the code written below
        return res.end();
    }
    if(url === '/message' && method === 'POST'){
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        // Once all data has been streamed
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFileSync('message.txt', `${message}`);
        })
        // We concatinate them into parsedBody
        // Function for every data
        // Listening for data event
        
        res.writeHead(302, {'Location' : '/'});
        // 302 is status code for redirection
        // Or res.statusCode = 302 ; res.setHeader('Location', '/');
        return res.end();
    }
    res.setHeader('Content-Type' , 'text/html');
    // Many headers don't need to be set and can be done using a package for us
    // Type of content which is part of response is html
    res.write('<html>');
    res.write('<head><title>My Home</title></head>');
    res.write('<body><h1> Hello from Node JS </h1> </body>');
    res.write('</html>');
    res.end();
    // process.exit();  
});
server.listen(3000);