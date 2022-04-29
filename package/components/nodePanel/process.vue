<template>
  <a-form :form="form" ref="xForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16}">

    <a-form-item label="流程">
      <a-input v-decorator="['id']" :disabled="true"/>
    </a-form-item>
    <a-form-item label="模板">
      <a-select placeholder="请选择" @change="onChange"
                v-decorator="['templateId', {rules: [{required: false, message: '请选择流程'}]}]">
        <a-select-option v-for="item in templateNames" :key="item.id" :template="item">
          {{ item.name }}
        </a-select-option>
      </a-select>
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
  props: {
    processNames: {
      type: Array,
      required: false
    },
    templateNames: {
      type: Array,
      required: true
    }
  },
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
        id: this.formData.id,
        templateId: this.formData.templateId,
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
    onChange(val,option){
      let template = option.data.attrs.template || {}
      let text = template.text || ''
      let {id} = this.form.getFieldsValue(['id']);
      text = text.replace('id="{processId}"', ' id="' + id + '" ')
      text = text.replace('flowable:templateId="{templateId}"', 'flowable:templateId="'+val+'"')
      this.$emit('templateChange',text)
      // this.form.setFieldsValue({templateId:val})
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
