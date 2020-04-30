function log(text, ...parmas){
    if(process.env.MOCK){
        console.log(text,...parmas);
    }
}

export { log }