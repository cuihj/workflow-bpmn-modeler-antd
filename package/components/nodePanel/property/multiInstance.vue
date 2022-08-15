<template>
  <div>
    <a-modal
        title="多实例配置"
        :visible.sync="dialogVisible"
        :show-close="false"
        @ok="onSave"
        cancelText="清空"
        okText="确定"
        @cancel="onCancel"
    >
      <a-alert
          :closable="false"
          style="margin-bottom: 20px"
      >
        <template #message>
          按照BPMN2.0规范的要求，用于为每个实例创建执行的父执行，会提供下列变量:<br>
          nrOfInstances：实例总数。<br>
          nrOfActiveInstances：当前活动的（即未完成的），实例数量。对于顺序多实例，这个值总为1。<br>
          nrOfCompletedInstances：已完成的实例数量。<br>
          loopCounter：给定实例在for-each循环中的index。<br>
        </template>
      </a-alert>
      <a-form :form="form" ref="xForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 14}">
        <a-form-item>
            <span slot="label">
            集合
              <a-tooltip>
                <template #title>
                  属性会作为表达式进行解析。如果表达式解析为字符串而不是一个集合，
                  <br/>不论是因为本身配置的就是静态字符串值，还是表达式计算结果为字符串，
                  <br/>这个字符串都会被当做变量名，并从流程变量中用于获取实际的集合。
                </template>
                <a-icon type="question-circle-o"/>
              </a-tooltip>
          </span>
          <a-input v-decorator="['collection', { rules: [{ required: true, message: '集合不能为空' }] }]"/>
        </a-form-item>
        <a-form-item>
             <span slot="label">
          元素变量&nbsp;
              <a-tooltip>
                <template #title>
                  每创建一个用户任务前，先以该元素变量为label，集合中的一项为value，
                  <br/>创建（局部）流程变量，该局部流程变量被用于指派用户任务。
                  <br/>一般来说，该字符串应与指定人员变量相同。
                </template>
                <a-icon type="question-circle-o"/>
              </a-tooltip>
             </span>
          <a-input v-decorator="['elementVariable', { rules: [{ required: true, message: '元素变量不能为空' }] }]"/>
        </a-form-item>
        <a-form-item label="执行方式">
          <a-radio-group v-decorator="['isSequential', { rules: [{ required: true, message: '不能为空' }] }]">
            <a-radio :value="true">
              串行
            </a-radio>
            <a-radio :value="false">
              并行
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item>
          <span slot="label">
              完成条件&nbsp;
              <a-tooltip>
                <template #title>
                  多实例活动在所有实例都完成时结束，然而也可以指定一个表达式，在每个实例
                  <br/>结束时进行计算。当表达式计算为true时，将销毁所有剩余的实例，并结束多实例<br/>活动，继续执行流程。例如 ${nrOfCompletedInstances/nrOfInstances >= 0.6 }，
                  <br/>表示当任务完成60%时，该节点就算完成
                </template>
                <a-icon type="question-circle-o"/>
              </a-tooltip>
          </span>
          <a-input v-decorator="['completionCondition']"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
import { formatJsonKeyValue } from '../../../common/parseElement'

export default {
  mixins: [mixinPanel],
  data() {
    return {
      form: this.$form.createForm(this),
      dialogVisible: true,
      formData: {}
    }
  },
  computed: {},
  mounted() {
    const cache = JSON.parse(JSON.stringify(this.element.businessObject.loopCharacteristics ?? {}))
    cache.completionCondition = cache.completionCondition?.body
    this.formData = formatJsonKeyValue(cache)
    this.$nextTick(() => {
      let data = {}
      for (let field of this.getFields()) {
        data [field] = this.formData [field]
      }
      this.form.setFieldsValue(data)
    })
  },
  methods: {
    getFields() {
      return Object.keys(this.form.domFields)
    },
    updateElement() {
      if (this.formData.isSequential !== null || this.formData.isSequential !== undefined) {
        let loopCharacteristics = this.element.businessObject.get('loopCharacteristics')
        if (!loopCharacteristics) {
          loopCharacteristics = this.modeler.get('moddle').create('bpmn:MultiInstanceLoopCharacteristics')
        }
        loopCharacteristics['isSequential'] = this.formData.isSequential
        loopCharacteristics['collection'] = this.formData.collection
        loopCharacteristics['elementVariable'] = this.formData.elementVariable
        if (this.formData.completionCondition) {
          const completionCondition = this.modeler.get('moddle').create('bpmn:Expression', { body: this.formData.completionCondition })
          loopCharacteristics['completionCondition'] = completionCondition
        }
        this.updateProperties({ loopCharacteristics: loopCharacteristics })
      } else {
        delete this.element.businessObject.loopCharacteristics
      }
    },
    onSave() {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.formData = values
          this.updateElement()
          this.dialogVisible = false
          this.$emit('close')
        }
      })
    },
    onCancel() {
      this.formData = {}
      delete this.element.businessObject.loopCharacteristics
      this.updateProperties({ loopCharacteristics: null })
      this.$emit('close')
    }
  }
}
</script>

<style>
.muti-instance .el-form-item {
  margin-bottom: 22px;
}
</style>
