/*---------------------------------------------------------------------------------------------
 * Classname
 *--------------------------------------------------------------------------------------------*/

const
io = require('../io')
, { fObject } = require('../fw')
;;

module.exports = class __classname extends fObject {

    classname(){
        return { name: this.constructor.name, cls: this.constructor }
    }

    static classname(){

        const
        name = this.toString().replace(/\n+/gui, ' ').split(/\s+/gui)[1].trim()
        ;;

        var cls;
        [
            'lib/entities'
            , 'lib/models'
            , 'lib/interfaces'
        ].forEach(prefix => {
            if(io.exists(prefix + '/' + name + '.js')) cls = require('../../' + prefix + '/' + name.toLowerCase())
        })

        return { name, cls }
    }

}