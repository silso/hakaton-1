export async function callGetTestEndpoint() {
    try{
        const response = await fetch('http://localhost:3001/testGET');
        return await response.text();
    }catch(error) {
        return error;
    }
}