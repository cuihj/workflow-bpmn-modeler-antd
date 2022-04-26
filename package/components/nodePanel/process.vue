<template>
  <a-form :form="form" ref="xForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16}">

    <a-form-item label="节点 id">
      <a-input v-decorator="['id', { rules: [{ required: true, message: 'Id 不能为空' }] }]"/>
    </a-form-item>
    <a-form-item label="节点名称">
      <a-input v-decorator="['name', { rules: [{ required: true, message: '名称不能为空' }] }]"/>
    </a-form-item>
    <a-form-item label="数据库schema">
      <a-input v-decorator="['schema', { rules: [{ required: false, message: 'schema不能为空' }] }]"/>
    </a-form-item>
    <a-form-item label="数据表单">
      <a-input v-decorator="['dataForm', { rules: [{ required: true, message: '数据表单不能为空' }] }]"/>
    </a-form-item>
    <a-form-item label="接口地址">
      <a-input v-decorator="['apiUrl', { rules: [{ required: false, message: '接口地址不能为空' }] }]"/>
    </a-form-item>
    <a-form-item label="节点描述">
      <a-input v-decorator="['documentation',{ rules: [{ required: true, message: '节点描述不能为空' }] }]"/>
    </a-form-item>
  </a-form>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
// import mixinExecutionListener from '../../common/mixinExecutionListener'
// import signalDialog from './property/signal'
import { commonParse } from '../../common/parseElement'
export default {
  components: {
    //signalDialog
  },
  mixins: [mixinPanel],
  // mixins: [mixinPanel, mixinExecutionListener],
  data() {
    return {
      form: this.$form.createForm(this, {onValuesChange:this.onValuesChange}),
      signalLength: 0,
      formData: {}
    }
  },
  computed: {
  },
  watch: {
    // 'formData.processCategory': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:processCategory': val })
    // }
  },
  created() {
    this.formData = commonParse(this.element)
    this.$nextTick(() => {
      this.form.setFieldsValue({
        schema: this.formData.schema,
        id: this.formData.id,
        name: this.formData.name,
        dataForm: this.formData.dataForm,
        apiUrl: this.formData.apiUrl,
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
    },
    onValuesChange: function(prop, values) {
      for (var key in values) {
        this.formData[key] = values[key]
      }
      this.updateCommonProperties(values);
    }
  }
}
</script>

<style>

</style>
