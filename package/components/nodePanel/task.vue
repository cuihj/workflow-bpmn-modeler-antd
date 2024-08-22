<template>
  <div>
    <a-form :form="form" ref="xForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16}">
      <a-form-item label="节点 id">
        <a-input v-decorator="['id', { rules: [{ required: true, message: '节点 id不能为空' }] }]"/>
      </a-form-item>
      <a-form-item label="节点名称">
        <a-input v-decorator="['name', { rules: [{ required: true, message: '节点名称不能为空' }] }]"/>
      </a-form-item>
      <a-form-item label="节点描述">
        <a-input v-decorator="['documentation']"/>
      </a-form-item>
      <a-form-item label="会签">
        <a-checkbox
            v-decorator="['multiInstance',{valuePropName:'checked',initialValue:false}]"></a-checkbox>
      </a-form-item>
      <a-form-item label="人员类型" v-show="formData.multiInstance!==true">
        <a-select
            v-decorator="['userType', {rules: [{required: true, message: '请选择人员类型'}]}]">
          <a-select-option v-for="item in userTypeOption" :key="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-show="formData.multiInstance!==true && formData.userType === 'assignee'" label="指定人员">
        <a-select v-decorator="['assignee']" :filter-option="filterOption" show-search>
          <a-select-option v-for="item in users" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-show="formData.multiInstance!==true && formData.userType === 'candidateUsers'"
                   label="候选人员">
        <a-select placeholder="候选人员" mode="multiple"
                  :filter-option="filterOption"
                  v-decorator="['candidateUsers']">
          <a-select-option v-for="item in users" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-show="formData.multiInstance!==true && formData.userType === 'candidateGroups'"
                   label="候选组">
        <a-select placeholder="候选组" mode="multiple" v-decorator="['candidateGroups']"
                  :filter-option="filterOption"
        >
          <a-select-option v-for="item in groups" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-show="formData.multiInstance===true"
                   label="会签人员">
        <a-select placeholder="会签人员" mode="multiple"
                  :filter-option="filterOption"
                  v-decorator="['multiInstanceUsers', { rules: [{ required: true, message: '不能为空' }] }]">
          <a-select-option v-for="item in users" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="执行方式" v-show="formData.multiInstance===true">
        <a-radio-group v-decorator="['isSequential', { rules: [{ required: true, message: '不能为空' }] }]">
          <a-radio :value="true">
            串行
          </a-radio>
          <a-radio :value="false">
            并行
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-show="formData.multiInstance===true">
           <span slot="label">
              会签人数&nbsp;
              <a-tooltip>
                <template #title>
                  会签人数达到(>=) 任务完成 ，如会签人员是三个，设立设置3表示所有人员都必须审批，
                </template>
                <a-icon type="question-circle-o"/>
              </a-tooltip>
          </span>
        <a-input-number :min="1"
                        v-decorator="['completionConditionNum', { rules: [{ required: true, message: '不能为空' }] }]"/>
      </a-form-item>
      <a-form-item label="节点表单">
        <a-input v-decorator="['formKey']"/>
      </a-form-item>
    </a-form>
    <!--    <multiInstanceDialog-->
    <!--        v-if="dialogName === 'multiInstanceDialog'"-->
    <!--        :element="element"-->
    <!--        :modeler="modeler"-->
    <!--        @close="finishMultiInstance"-->
    <!--    />-->
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
// import executionListenerDialog from './property/executionListener'
// import taskListenerDialog from './property/taskListener'
// import multiInstanceDialog from './property/multiInstance'
import {commonParse, userTaskParse} from '../../common/parseElement'

export default {
  components: {
    // executionListenerDialog,
    // taskListenerDialog,
    //multiInstanceDialog
  },
  mixins: [mixinPanel],
  props: {
    users: {
      type: Array,
      required: true
    },
    groups: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this, {onValuesChange: this.onValuesChange}),
      userTypeOption: [
        {label: '指定人员', value: 'assignee'},
        {label: '候选人员', value: 'candidateUsers'},
        {label: '候选组', value: 'candidateGroups'}
      ],
      dialogName: '',
      executionListenerLength: 0,
      taskListenerLength: 0,
      init: false,
      hasMultiInstance: false,
      formData: {}
    }
  },
  computed: {},
  watch: {
    // 'formData.userType': function(val, oldVal) {
    //   if (oldVal) {
    //     const types = ['assignee', 'candidateUsers', 'candidateGroups']
    //     types.forEach(type => {
    //       delete this.element.businessObject.$attrs[`flowable:${type}`]
    //       delete this.formData[type]
    //     })
    //   }
    // },
    // 'formData.assignee': function(val) {
    //   if (this.formData.userType !== 'assignee') {
    //     delete this.element.businessObject.$attrs[`flowable:assignee`]
    //     return
    //   }
    //   this.updateProperties({ 'flowable:assignee': val })
    // },
    // 'formData.candidateUsers': function(val) {
    //   if (this.formData.userType !== 'candidateUsers') {
    //     delete this.element.businessObject.$attrs[`flowable:candidateUsers`]
    //     return
    //   }
    //   this.updateProperties({ 'flowable:candidateUsers': val?.join(',') })
    // },
    // 'formData.candidateGroups': function(val) {
    //   if (this.formData.userType !== 'candidateGroups') {
    //     delete this.element.businessObject.$attrs[`flowable:candidateGroups`]
    //     return
    //   }
    //   this.updateProperties({ 'flowable:candidateGroups': val?.join(',') })
    // },
    // 'formData.async': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:async': true })
    // },
    // 'formData.dueDate': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:dueDate': val })
    // },
    // 'formData.formKey': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:formKey': val })
    // },
    // 'formData.priority': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:priority': val })
    // },
    // 'formData.skipExpression': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:skipExpression': val })
    // },
    // 'formData.isForCompensation': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'isForCompensation': val })
    // },
    // 'formData.triggerable': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:triggerable': val })
    // },
    // 'formData.class': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:class': val })
    // },
    // 'formData.autoStoreVariables': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:autoStoreVariables': val })
    // },
    // 'formData.exclude': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:exclude': val })
    // },
    // 'formData.ruleVariablesInput': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:ruleVariablesInput': val })
    // },
    // 'formData.rules': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:rules': val })
    // },
    // 'formData.resultVariable': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:resultVariable': val })
    // }
  },
  created() {
    this.init = true
    this.$nextTick(() => {
      let cache = commonParse(this.element)
      cache = userTaskParse(cache)
      console.log(cache)
      this.formData = cache
      let multiInstance = false
      if (cache.loopCharacteristics) {
        multiInstance = true
      }
      this.formData.multiInstance = multiInstance
      this.form.setFieldsValue({
        id: this.formData.id,
        name: this.formData.name,
        documentation: this.formData.documentation,
        userType: this.formData.userType,
        candidateUsers: this.formData.candidateUsers,
        multiInstance: multiInstance,
        multiInstanceUsers: this.formData.multiInstanceUsers,
        isSequential: this.formData.isSequential,
        completionConditionNum: this.formData.completionConditionNum,
        candidateGroups: this.formData.candidateGroups,
        assignee: this.formData.assignee,
        formKey: this.formData.formKey
      })
      this.init = false
    })
    // this.computedExecutionListenerLength()
    // this.computedTaskListenerLength()
  },
  methods: {
    onValuesChange(prop, values) {
      if (this.init === true) {
        return
      }
      for (var key in values) {
        this.formData[key] = values[key]
      }
      this.updateCommonProperties(values)

      if (values.hasOwnProperty('multiInstance')) {
        //delete this.element.businessObject.$attrs[`flowable:assignee`] flowable:assignee="${assignee}"
        const multiInstance = values.multiInstance
        if (multiInstance === true) {
          let loopCharacteristics = this.element.businessObject.get('loopCharacteristics')
          if (!loopCharacteristics) {
            loopCharacteristics = this.modeler.get('moddle').create('bpmn:MultiInstanceLoopCharacteristics')
          }
          loopCharacteristics['collection'] = 'assigneeList'
          loopCharacteristics['elementVariable'] = 'assignee'
          loopCharacteristics['isSequential'] = this.formData.isSequential === true
          let extensionElements = this.element.businessObject.get('extensionElements')
          if (!extensionElements) {
            extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
          }
          this.updateProperties({
            'flowable:assignee': '${assignee}',
            extensionElements: extensionElements,
            loopCharacteristics: loopCharacteristics
          })
        } else {
          delete this.element.businessObject.loopCharacteristics
          delete this.element.businessObject.extensionElements
          //delete this.element.businessObject.$attrs[`extensionElements`, `loopCharacteristics`]
          this.updateProperties({extensionElements: null, loopCharacteristics: null})
        }
      }
      if (values.hasOwnProperty('multiInstanceUsers')) {
        if (this.config.className) {
          let extensionElements = this.element.businessObject.get('extensionElements')
          if (!extensionElements) {
            extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
          }
          // 清除旧值
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:ExecutionListener') ?? []
          const taskListener = this.modeler.get('moddle').create('flowable:ExecutionListener')
          taskListener['event'] = 'start'
          taskListener['class'] = this.config.className
          var multiInstanceUsers = values.multiInstanceUsers || []
          const val = multiInstanceUsers.join(',')
          const fieldElement = this.modeler.get('moddle').create('flowable:Field')
          fieldElement['name'] = 'assignee'
          // 注意：flowable.json 中定义的string和expression类为小写，不然会和原生的String类冲突，此处为hack
          const valueElement = this.modeler.get('moddle').create(`flowable:string`, {body: val})
          fieldElement['string'] = valueElement
          taskListener.get('fields').push(fieldElement)
          extensionElements.get('values').push(taskListener)
          this.updateProperties({extensionElements: extensionElements})
        }
      }
      if (values.hasOwnProperty('completionConditionNum')) {
        let loopCharacteristics = this.element.businessObject.get('loopCharacteristics')
        if (!loopCharacteristics) {
          loopCharacteristics = this.modeler.get('moddle').create('bpmn:MultiInstanceLoopCharacteristics')
        }
        const completionConditionNum = values.completionConditionNum

        loopCharacteristics['isSequential'] = this.formData.isSequential === true
        const completionCondition = this.modeler.get('moddle').create('bpmn:Expression', {body: ('${multiInstance.completedCondition(execution,' + completionConditionNum + ')}')})
        // const completionCondition = this.modeler.get('moddle').create('bpmn:Expression', {body: ('${nrOfCompletedInstances>=' + completionConditionNum + '}')})
        loopCharacteristics['completionCondition'] = completionCondition
        this.updateProperties({loopCharacteristics: loopCharacteristics})
      }
      if (values.hasOwnProperty('isSequential')) {
        let loopCharacteristics = this.element.businessObject.get('loopCharacteristics')
        if (!loopCharacteristics) {
          loopCharacteristics = this.modeler.get('moddle').create('bpmn:MultiInstanceLoopCharacteristics')
        }
        loopCharacteristics['isSequential'] = values.isSequential
        this.updateProperties({loopCharacteristics: loopCharacteristics})
      }

      if (values.hasOwnProperty('name')) {
        const val = values.name
        this.updateProperties({'name': val})
      } else if (values.hasOwnProperty('userType')) {
        // let val = values.userType
        // this.formData.userType = val
        const userType = prop.form.getFieldValue('userType')
        if (userType) {
          const types = ['assignee', 'candidateUsers', 'candidateGroups']
          types.forEach(type => {
            delete this.element.businessObject.$attrs[`flowable:${type}`]
          })
        }
      } else if (values.hasOwnProperty('assignee')) {
        const val = values.assignee
        const userType = prop.form.getFieldValue('userType')
        if (userType !== 'assignee') {
          delete this.element.businessObject.$attrs[`flowable:assignee`]
          return
        }
        this.updateProperties({'flowable:assignee': val})
      } else if (values.hasOwnProperty('candidateUsers')) {
        const val = values.candidateUsers
        const userType = prop.form.getFieldValue('userType')
        if (userType !== 'candidateUsers') {
          delete this.element.businessObject.$attrs[`flowable:candidateUsers`]
          return
        }
        this.updateProperties({'flowable:candidateUsers': val?.join(',')})
      } else if (values.hasOwnProperty('candidateGroups')) {
        const val = values.candidateGroups
        const userType = prop.form.getFieldValue('userType')
        if (userType !== 'candidateGroups') {
          delete this.element.businessObject.$attrs[`flowable:candidateGroups`]
          return
        }
        this.updateProperties({'flowable:candidateGroups': val?.join(',')})
      } else if (values.hasOwnProperty('formKey')) {
        const formKey = prop.form.getFieldValue('formKey')
        this.updateProperties({'flowable:formKey': formKey})
      }
    },
    // computedExecutionListenerLength() {
    //   this.executionListenerLength = this.element.businessObject.extensionElements?.values
    //       ?.filter(item => item.$type === 'flowable:ExecutionListener').length ?? 0
    // },
    // computedTaskListenerLength() {
    //   this.taskListenerLength = this.element.businessObject.extensionElements?.values
    //       ?.filter(item => item.$type === 'flowable:TaskListener').length ?? 0
    // },
    // computedHasMultiInstance() {
    //   if (this.formData.multiInstanceUsers) {
    //     this.formData.multiInstance = true;
    //     this.form.setFieldsValue({multiInstance: true})
    //   } else {
    //     this.formData.multiInstance = false;
    //     this.form.setFieldsValue({multiInstance: false})
    //   }
    // },
    // finishExecutionListener() {
    //   if (this.dialogName === 'executionListenerDialog') {
    //     this.computedExecutionListenerLength()
    //   }
    //   this.dialogName = ''
    // },
    // finishTaskListener() {
    //   if (this.dialogName === 'taskListenerDialog') {
    //     this.computedTaskListenerLength()
    //   }
    //   this.dialogName = ''
    // },
    // finishMultiInstance() {
    //   if (this.dialogName === 'multiInstanceDialog') {
    //     this.computedHasMultiInstance()
    //   }
    //   this.dialogName = ''
    // },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>

<style></style>
