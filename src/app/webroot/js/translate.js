(function(fw, args){

    GET('/dictionary/' + fw.Locale || 'pt_BR', res => fw.caches.dict = res)

    fw.translate = arg => {
        return fw.caches.dict[arg] || arg
    }

})