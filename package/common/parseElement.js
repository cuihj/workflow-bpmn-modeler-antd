export function commonParse(element) {
    const result = {
        ...element.businessObject,
        ...element.businessObject.$attrs
    }
    var obj = formatJsonKeyValue(result)
    return multiInstanceParse(obj);
}

export function formatJsonKeyValue(result) {
    // 移除flowable前缀，格式化数组
    for (const key in result) {
        if (key.indexOf('flowable:') === 0) {
            const newKey = key.replace('flowable:', '')
            result[newKey] = result[key]
            delete result[key]
        }
    }
    result = documentationParse(result)
    return result
}

export function documentationParse(obj) {
    if ('documentation' in obj) {
        let str = ''
        obj.documentation.forEach(item => {
            str += item.text
        })
        obj.documentation = str
    }
    return obj
}

export function conditionExpressionParse(obj) {
    if ('conditionExpression' in obj) {
        obj.conditionExpression = obj.conditionExpression.body
    }
    return obj
}

export function multiInstanceParse(obj) {
    if (obj.loopCharacteristics) {
        if (obj.loopCharacteristics.completionCondition) {
            //${nrOfCompletedInstances>=2}
            const nrOfCompletedInstances = obj.loopCharacteristics.completionCondition.body
            if (nrOfCompletedInstances) {
                var match = nrOfCompletedInstances.match(/\d+/)
                if (match) {
                    obj.completionConditionNum = match[0]
                }
            }
        }
        obj.isSequential = obj.loopCharacteristics.isSequential === true
    }
    if (obj.extensionElements && obj.extensionElements.values && obj.extensionElements.values.length > 0) {
        //${nrOfCompletedInstances>=2}
        const fields = obj.extensionElements.values[0].fields
        if (fields.length > 0) {
            var str = fields[0].string
            if (str && str.body) {
                obj.multiInstanceUsers = str.body.split(',')
            }
        }
    }
    return obj
}

export function userTaskParse(obj) {
    let candidateUsers = obj.candidateUsers
    if (candidateUsers) {
        obj.candidateUsers = candidateUsers && candidateUsers.split(',') || []
        obj.userType = 'candidateUsers'
    }
    let candidateGroups = obj.candidateGroups
    if (candidateGroups) {
        obj.candidateGroups = candidateGroups && candidateGroups.split(',') || []
        obj.userType = 'candidateGroups'
    }
    if (obj.assignee) {
        obj.userType = 'assignee'
    }
    return obj
}
