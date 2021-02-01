<template>
  <div>
    <a-form :form="form" ref="xForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16}">
      <a-form-item label="节点 id">
        <a-input v-decorator="['id', { rules: [{ required: true, message: 'Id 不能为空' }] }]"/>
      </a-form-item>
      <a-form-item label="节点名称">
        <a-input v-decorator="['name']"/>
      </a-form-item>
      <a-form-item label="节点描述">
        <a-input v-decorator="['documentation']"/>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
// import mixinExecutionListener from '../../common/mixinExecutionListener'
import { commonParse } from '../../common/parseElement'
export default {
  mixins: [mixinPanel],
  data() {
    return {
      form: this.$form.createForm(this, {onValuesChange:this.onValuesChange}),
      formData: {}
    }
  },
  computed: {
  },
  watch: {
    // 'formData.async': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:async': val })
    // }
  },
  created() {
    this.formData = commonParse(this.element)
    this.$nextTick(() => {
      this.form.setFieldsValue({
        id: this.formData.id,
        name: this.formData.name||'',
        documentation: this.formData.documentation
      })
    })
  },
  methods: {
    onValuesChange: function(prop, values) {
      for (var key in values) {
        this.formData[key] = values[key]
      }
      this.updateCommonProperties(values);
    }
  },
}
</script>

<style>

</style>
