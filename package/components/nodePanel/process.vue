<template>
  <a-form :form="form" ref="xForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16}">
    <a-form-item label="节点 id">
      <a-input v-decorator="['id', { rules: [{ required: true, message: 'Id 不能为空' }] }]"/>
    </a-form-item>
    <a-form-item label="节点名称">
      <a-input v-decorator="['name', { rules: [{ required: true, message: 'Id 不能为空' }] }]"/>
    </a-form-item>
    <a-form-item label="节点描述">
      <a-input v-decorator="['documentation', { rules: [{ required: true, message: 'Id 不能为空' }] }]"/>
    </a-form-item>
  </a-form>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
// import signalDialog from './property/signal'
import { commonParse } from '../../common/parseElement'
export default {
  components: {
    //signalDialog
  },
  mixins: [mixinPanel, mixinExecutionListener],
  data() {
    return {
      form: this.$form.createForm(this, {}),
      signalLength: 0,
      formData: {}
    }
  },
  computed: {
    // formConfig() {
    //   const _this = this
    //   return {
    //     inline: false,
    //     item: [
    //       {
    //         xType: 'select',
    //         name: 'processCategory',
    //         label: '流程分类',
    //         dic: { data: _this.categorys, label: 'name', value: 'id' }
    //       },
    //       {
    //         xType: 'input',
    //         name: 'id',
    //         label: '流程标识key',
    //         rules: [{ required: true, message: 'Id 不能为空' }]
    //       },
    //       {
    //         xType: 'input',
    //         name: 'name',
    //         label: '流程名称'
    //       },
    //       {
    //         xType: 'colorPicker',
    //         name: 'color',
    //         label: '节点颜色'
    //       },
    //       {
    //         xType: 'input',
    //         name: 'documentation',
    //         label: '节点描述'
    //       },
    //       {
    //         xType: 'slot',
    //         name: 'executionListener',
    //         label: '执行监听器'
    //       },
    //       {
    //         xType: 'slot',
    //         name: 'signal',
    //         label: '信号定义'
    //       }
    //     ]
    //   }
    // }
  },
  watch: {
    'formData.processCategory': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:processCategory': val })
    }
  },
  created() {
    this.formData = commonParse(this.element)
    console.log(this.formData)
    this.$nextTick(() => {
      this.form.setFieldsValue({
        id: this.formData.id,
        name: this.formData.name,
        documentation: this.formData.documentation
      })
    })
  },
  methods: {
    computedSignalLength() {
      this.signalLength = this.element.businessObject.extensionElements?.values?.length ?? 0
    },
    finishSignal() {
      if (this.dialogName === 'signalDialog') {
        this.computedSignalLength()
      }
      this.dialogName = ''
    }
  }
}
</script>

<style>

</style>
