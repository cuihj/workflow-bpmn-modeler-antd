<template>
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
    <a-form-item label="跳转条件">
      <a-input v-decorator="['conditionExpression']"/>
    </a-form-item>
    <a-form-item label="跳过表达式">
      <a-input v-decorator="['skipExpression']"/>
    </a-form-item>
  </a-form>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
// import mixinExecutionListener from '../../common/mixinExecutionListener'
import { commonParse, conditionExpressionParse } from '../../common/parseElement'
export default {
  mixins: [mixinPanel],
  data() {
    return {
      form: this.$form.createForm(this, { onValuesChange: this.onValuesChange }),
      formData: {}
    }
  },
  computed: {
    // formConfig() {
    //   return {
    //     inline: false,
    //     item: [
    //       {
    //         xType: 'input',
    //         name: 'id',
    //         label: '节点 id',
    //         rules: [{ required: true, message: 'Id 不能为空' }]
    //       },
    //       {
    //         xType: 'input',
    //         name: 'name',
    //         label: '节点名称'
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
    //         xType: 'input',
    //         name: 'conditionExpression',
    //         label: '跳转条件'
    //       },
    //       {
    //         xType: 'input',
    //         name: 'skipExpression',
    //         label: '跳过表达式'
    //       }
    //     ]
    //   }
    // }
  },
  watch: {
    // 'formData.conditionExpression': function(val) {
    //   if (val) {
    //     const newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: val })
    //     this.updateProperties({ conditionExpression: newCondition })
    //   } else {
    //     this.updateProperties({ conditionExpression: null })
    //   }
    // },
    // 'formData.skipExpression': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'flowable:skipExpression': val })
    // }
  },
  methods:{
    onValuesChange: function(prop, values) {
      for (var key in values) {
        this.formData[key] = values[key]
      }
      this.updateCommonProperties(values);
      if (values.hasOwnProperty('conditionExpression')) {
        let val = values.conditionExpression
        if (val) {
          const newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: val })
          this.updateProperties({ conditionExpression: newCondition })
        } else {
          this.updateProperties({ conditionExpression: null })
        }
      } else if (values.hasOwnProperty('skipExpression')) {
        let val = values.skipExpression
        if (val === '') val = null
        this.updateProperties({ 'flowable:skipExpression': val })
      }
    }
  },
  created() {
    let cache = commonParse(this.element)
    cache = conditionExpressionParse(cache)
    this.formData = cache
    this.$nextTick(() => {
      this.form.setFieldsValue({
        id: this.formData.id,
        name: this.formData.name,
        conditionExpression: this.formData.conditionExpression,
        documentation: this.formData.documentation,
        skipExpression: this.formData.skipExpression
      })
    })
  }
}
</script>

<style></style>
