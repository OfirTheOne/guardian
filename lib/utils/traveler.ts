/**
 * @example
 * dotProtocolPathRegex.test('user'); // --> true
 * dotProtocolPathRegex.test('user.street'); // --> true
 * dotProtocolPathRegex.test('user.street.'); // --> false
 * dotProtocolPathRegex.test('.street.'); // --> false
 * 
 */
// const dotProtocolPathRegex = /^((\w|\$)+(-(\w|\$)+)*)+(\.(\w|\$)+(-(\w|\$)+)*)*$/; // /^(\w+(\.(\w+))?)+$/;
// const dotProtocolPathRegex = /^((\w|\$)+(-(\w|\$)+)*)+((\[\d+(-\d+)?\])|(\.(\w|\$)+(-(\w|\$)+)*))*$/; // /^(\w+(\.(\w+))?)+$/;


/**
 * @example
 * dotProtocolPathRegex.test('list[10]'); // --> true
 * dotProtocolPathRegex.test('list[10-15]'); // --> true
 * dotProtocolPathRegex.test('list[-7]'); // --> true
 * dotProtocolPathRegex.test('list[$]'); // --> true
 * dotProtocolPathRegex.test('list[10-$]'); // --> true
 * dotProtocolPathRegex.test('list[-6-$]'); // --> true
 * dotProtocolPathRegex.test('list[-6-16]'); // --> false
 * dotProtocolPathRegex.test('list[$-10]'); // --> false
 * 
 */
const dotProtocolPathRegex = /^((\w|\$)+(-(\w|\$)+)*)+((\[((\d+(-(\d+|\$))?)|(\$)|(-\d+(-\$)?))\])|(\.(\w|\$)+(-(\w|\$)+)*))*$/; // /^(\w+(\.(\w+))?)+$/;



const integerRegex = /^-?(\d+)$/
const dollarSignRegex = /^\$$/

/** 
 * @description
 * return (multiple level) nested element from any object, 
 * using a 'path' string constructed from the parents names of the desired sub element, by there existing order.
 * 
 * @example
 * const path = 'user.address.street'
 * const otherPath = 'user.address.home'
 * const user = { address: { street: 'myStreetName', no: 10 } };
 * const street = getNestedElementsWithPath({ user }, path); 
 * console.log(street); // output : 'myStreetName'
 * const home = getNestedElementsWithPath({ user }, otherPath); 
 * console.log(home); // output : undefined
 * 
 * @param obj 
 * @param dotProtocolPath 
 */
export function getNestedElementByPath(obj: any, dotProtocolPath: (string|Array<string>)) {
    let slicedPath: any[];
    if(typeof dotProtocolPath == 'string') {

        if(!dotProtocolPathRegex.test(dotProtocolPath)) {
            throw new Error(dotProtocolPath)
        }
        slicedPath = dotProtocolPath.split('.'); 
    
        slicedPath = slicedPath.reduce((list, s) => {
            let splits = s.split(/\[|\]/).filter(slice => slice != "")
            let bracketsContent = []
    
            if(splits.length > 1) {
                bracketsContent = splits.slice(1).map(_s => compileArrayAccess(_s));
            } 
            return [...list, splits[0], ...bracketsContent]
        }, [])
    } else {
        slicedPath = dotProtocolPath;
    }

    let curLvlElement = obj;
    let lvl = 0;
    const targetDepth = slicedPath.length;

    for(; lvl < targetDepth; lvl++) {
        try {
            if(curLvlElement == undefined) { break; }
            let elementName = slicedPath[lvl];
            if(typeof elementName == 'string') {
                curLvlElement = curLvlElement[elementName];

            } else if(Array.isArray(elementName)) {

                if(elementName[0] == '$' && elementName.length == 1) {
                    elementName = [0, '$'];
                }

                if(elementName.length == 1 && typeof elementName[0] == 'number') {
                    let relativeIndex = elementName[0] < 0 ? curLvlElement.length + elementName[0] : elementName[0];
                    curLvlElement = curLvlElement[relativeIndex];
                } 
                
                if(elementName.length == 2) {
                    const indexRange = [
                        elementName[0] < 0 ? curLvlElement.length + elementName[0] : elementName[0],
                        elementName[1] == '$' ? curLvlElement.length : elementName[1]
                    ];

                    curLvlElement = (curLvlElement as Array<any>)
                        .slice(indexRange[0], indexRange[1])
                        .map(item => getNestedElementByPath(item, slicedPath.slice(lvl+1)))
                    break;
                }

            }
        } catch (error) {
            // handle maybe console.log
            curLvlElement = undefined
            break;
        }
    }

    // if(lvl < slicedPath.length -1) {
    //     throw new Error();
    // }

    return curLvlElement;
}

// [1,2,3,4,5,6,7,8,9]
// 12-14
// $
// 5



function compileArrayAccess(bracketsContent: string) {
                
        if(dollarSignRegex.test(bracketsContent)) {         // $
            return [bracketsContent];

        } else if(integerRegex.test(bracketsContent)) {     // single integer // 9 // -7

            return [parseInt(bracketsContent)];
        } else if(bracketsContent.includes('-')){           // range of integers
            const low = bracketsContent.slice(0, bracketsContent.lastIndexOf('-'));
            const high = bracketsContent.slice(bracketsContent.lastIndexOf('-')+1);

            return [parseInt(low),high == '$' ? high : parseInt(high)];
        }   
    
}
/* 

export function getNestedElementParentByPath(obj: any, dotProtocolPath: string) {
    if(!dotProtocolPathRegex.test(dotProtocolPath)) {
        throw  new Error(dotProtocolPath);//new InvalidSubElementPathFormatError(dotProtocolPath)
    }
    const slicedPath = dotProtocolPath.split('.');
    let curLvlElement = obj;
    let lvl = 0
    const targetDepth = slicedPath.length-1;
    for(; lvl < targetDepth; lvl++) {
        try {
            if(curLvlElement == undefined) { break; }
            const elementName = slicedPath[lvl];
            curLvlElement = curLvlElement[elementName]
        } catch (error) {
            // handle maybe console.log
            curLvlElement = undefined
            break;
        }
    }

    if(lvl < targetDepth) {
        throw new Error(dotProtocolPath, obj);
    }

    return { parent: curLvlElement, pathToChild: slicedPath[lvl]};
}


*/