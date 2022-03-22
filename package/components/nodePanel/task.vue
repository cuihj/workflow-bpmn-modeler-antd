<template>
    <div>
        <a-form :form="form" ref="xForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16}">
            <a-form-item label="节点 id">
                <a-input v-decorator="['id', { rules: [{ required: true, message: 'Id 不能为空' }] }]"/>
            </a-form-item>
            <a-form-item label="节点名称">
                <a-input v-decorator="['name', { rules: [{ required: true, message: '名称不能为空' }] }]"/>
            </a-form-item>
            <a-form-item label="节点描述">
                <a-input v-decorator="['documentation']"/>
            </a-form-item>
            <a-form-item label="人员类型">
                <a-select placeholder="人员类型"
                          v-decorator="['userType', {rules: [{required: true, message: '请选择编码分类'}]}]">
                    <a-select-option v-for="item in userTypeOption" :key="item.value">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item v-show="formData.userType === 'assignee'"
                         label="指定人员">
                <a-select placeholder="指定人员"
                          v-decorator="['assignee']">
                    <a-select-option v-for="item in users" :key="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item v-show="formData.userType === 'candidateUsers'"
                         label="候选人员">
                <a-select placeholder="候选人员" mode="multiple"
                          v-decorator="['candidateUsers']">
                    <a-select-option v-for="item in users" :key="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item v-show="formData.userType === 'candidateGroups'"
                         label="候选组">
                <a-select placeholder="候选组" mode="multiple"
                          v-decorator="['candidateGroups']">
                    <a-select-option v-for="item in groups" :key="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>

    </div>
</template>

<script>
  import mixinPanel from '../../common/mixinPanel'
  // import executionListenerDialog from './property/executionListener'
  // import taskListenerDialog from './property/taskListener'
  // import multiInstanceDialog from './property/multiInstance'
  import { commonParse, userTaskParse } from '../../common/parseElement'

  export default {
    components: {
      // executionListenerDialog,
      // taskListenerDialog,
      // multiInstanceDialog
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
      }
    },
    data() {
      return {
        form: this.$form.createForm(this, { onValuesChange: this.onValuesChange }),
        userTypeOption: [
          { label: '指定人员', value: 'assignee' },
          { label: '候选人员', value: 'candidateUsers' },
          { label: '候选组', value: 'candidateGroups' }
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
      this.$nextTick(function() {
        let cache = commonParse(this.element)
        cache = userTaskParse(cache)
        this.formData = cache
        this.form.setFieldsValue({
          id: this.formData.id,
          name: this.formData.name,
          documentation: this.formData.documentation,
          userType: this.formData.userType,
          candidateUsers: this.formData.candidateUsers,
          candidateGroups: this.formData.candidateGroups,
          assignee: this.formData.assignee
        })
        this.init = false
      })
      // this.computedExecutionListenerLength()
      // this.computedTaskListenerLength()
      // this.computedHasMultiInstance()
    },
    methods: {
      onValuesChange: function(prop, values) {
        if (this.init === true) {
          return
        }
        for (var key in values) {
          this.formData[key] = values[key]
        }
        this.updateCommonProperties(values)
        if (values.hasOwnProperty('userType')) {
          // let val = values.userType
          // this.formData.userType = val
          let userType = prop.form.getFieldValue('userType')
          if (userType) {
            const types = ['assignee', 'candidateUsers', 'candidateGroups']
            types.forEach(type => {
              delete this.element.businessObject.$attrs[`flowable:${type}`]
            })
          }
        } else if (values.hasOwnProperty('assignee')) {
          let val = values.assignee
          let userType = prop.form.getFieldValue('userType')
          if (userType !== 'assignee') {
            delete this.element.businessObject.$attrs[`flowable:assignee`]
            return
          }
          this.updateProperties({ 'flowable:assignee': val })
        } else if (values.hasOwnProperty('candidateUsers')) {
          let val = values.candidateUsers
          let userType = prop.form.getFieldValue('userType')
          if (userType !== 'candidateUsers') {
            delete this.element.businessObject.$attrs[`flowable:candidateUsers`]
            return
          }
          this.updateProperties({ 'flowable:candidateUsers': val?.join(',') })
        } else if (values.hasOwnProperty('candidateGroups')) {
          console.log(values)
          let val = values.candidateGroups
          let userType = prop.form.getFieldValue('userType')
          if (userType !== 'candidateGroups') {
            delete this.element.businessObject.$attrs[`flowable:candidateGroups`]
            return
          }
          console.log(val)
          this.updateProperties({ 'flowable:candidateGroups': val?.join(',') })
        }
      },
      computedExecutionListenerLength() {
        this.executionListenerLength = this.element.businessObject.extensionElements?.values
          ?.filter(item => item.$type === 'flowable:ExecutionListener').length ?? 0
      },
      computedTaskListenerLength() {
        this.taskListenerLength = this.element.businessObject.extensionElements?.values
          ?.filter(item => item.$type === 'flowable:TaskListener').length ?? 0
      },
      computedHasMultiInstance() {
        if (this.element.businessObject.loopCharacteristics) {
          this.hasMultiInstance = true
        } else {
          this.hasMultiInstance = false
        }
      },
      finishExecutionListener() {
        if (this.dialogName === 'executionListenerDialog') {
          this.computedExecutionListenerLength()
        }
        this.dialogName = ''
      },
      finishTaskListener() {
        if (this.dialogName === 'taskListenerDialog') {
          this.computedTaskListenerLength()
        }
        this.dialogName = ''
      },
      finishMultiInstance() {
        if (this.dialogName === 'multiInstanceDialog') {
          this.computedHasMultiInstance()
        }
        this.dialogName = ''
      }
    }
  }
</script>

<style></style>
