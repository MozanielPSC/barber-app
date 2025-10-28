# Barber App - Formulários e Validação

## Visão Geral

Este documento descreve os padrões de formulários, validações, máscaras de input e tratamento de erros implementados no Barber App. Essas práticas são essenciais para manter a consistência e usabilidade na versão mobile.

## Padrões de Formulários

### Estrutura Base de Formulário

```vue
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Campos do formulário -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Campo 1 -->
      <div>
        <label for="campo1" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Campo 1 *
        </label>
        <input
          id="campo1"
          v-model="form.campo1"
          type="text"
          :class="inputClasses"
          :placeholder="'Digite o campo 1'"
          required
        />
        <div v-if="errors.campo1" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ errors.campo1 }}
        </div>
      </div>
      
      <!-- Campo 2 -->
      <div>
        <label for="campo2" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Campo 2
        </label>
        <input
          id="campo2"
          v-model="form.campo2"
          type="text"
          :class="inputClasses"
          :placeholder="'Digite o campo 2'"
        />
        <div v-if="errors.campo2" class="mt-1 text-sm text-red-600 dark:text-red-400">
          {{ errors.campo2 }}
        </div>
      </div>
    </div>
    
    <!-- Botões de ação -->
    <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
      <button
        type="button"
        @click="handleCancel"
        class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        Cancelar
      </button>
      <button
        type="submit"
        :disabled="isSubmitting || !isFormValid"
        class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
      >
        <span v-if="isSubmitting">Salvando...</span>
        <span v-else>Salvar</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// Estado do formulário
const form = reactive({
  campo1: '',
  campo2: ''
})

// Estado de validação
const errors = reactive({
  campo1: '',
  campo2: ''
})

const isSubmitting = ref(false)

// Classes CSS para inputs
const inputClasses = computed(() => {
  return 'w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all'
})

// Validação do formulário
const isFormValid = computed(() => {
  return form.campo1.trim() !== '' && Object.values(errors).every(error => error === '')
})

// Validação individual de campos
const validateField = (field: string, value: string) => {
  switch (field) {
    case 'campo1':
      if (!value.trim()) {
        errors.campo1 = 'Campo 1 é obrigatório'
      } else if (value.length < 3) {
        errors.campo1 = 'Campo 1 deve ter pelo menos 3 caracteres'
      } else {
        errors.campo1 = ''
      }
      break
    case 'campo2':
      if (value && value.length < 2) {
        errors.campo2 = 'Campo 2 deve ter pelo menos 2 caracteres'
      } else {
        errors.campo2 = ''
      }
      break
  }
}

// Handlers
const handleSubmit = async () => {
  // Validar todos os campos
  Object.keys(form).forEach(field => {
    validateField(field, form[field])
  })
  
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  
  try {
    // Enviar dados
    await submitForm(form)
    // Sucesso - redirecionar ou mostrar mensagem
  } catch (error) {
    // Tratar erro
    console.error('Erro ao salvar:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  // Limpar formulário ou navegar para trás
  Object.keys(form).forEach(key => {
    form[key] = ''
    errors[key] = ''
  })
}
</script>
```

## Tipos de Campos

### Campo de Texto Simples

```vue
<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}<span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <input
      :id="id"
      v-model="modelValue"
      type="text"
      :class="inputClasses"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @blur="validate"
      @input="handleInput"
    />
    <div v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const id = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const base = 'w-full px-3 py-2 rounded-lg text-sm transition-all'
  const colors = 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
  const border = props.error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
  const focus = 'focus:ring-2 focus:border-transparent'
  const disabled = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return `${base} ${colors} border ${border} ${focus} ${disabled}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const validate = () => {
  // Validação será feita pelo componente pai
}
</script>
```

### Campo de Email

```vue
<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}<span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <input
      :id="id"
      v-model="modelValue"
      type="email"
      :class="inputClasses"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @blur="validate"
      @input="handleInput"
    />
    <div v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
// Similar ao campo de texto, mas com validação específica de email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validate = () => {
  if (props.required && !props.modelValue.trim()) {
    emit('error', 'Email é obrigatório')
  } else if (props.modelValue && !validateEmail(props.modelValue)) {
    emit('error', 'Email inválido')
  } else {
    emit('error', '')
  }
}
</script>
```

### Campo de Telefone

```vue
<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}<span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <input
      :id="id"
      v-model="formattedValue"
      type="tel"
      :class="inputClasses"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @blur="validate"
      @input="handleInput"
    />
    <div v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const phoneMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  } else {
    return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  }
}

const formattedValue = computed({
  get: () => phoneMask(props.modelValue),
  set: (value) => {
    const cleaned = value.replace(/\D/g, '')
    emit('update:modelValue', cleaned)
  }
})

const validate = () => {
  const cleaned = props.modelValue.replace(/\D/g, '')
  
  if (props.required && !cleaned) {
    emit('error', 'Telefone é obrigatório')
  } else if (cleaned && (cleaned.length < 10 || cleaned.length > 11)) {
    emit('error', 'Telefone deve ter 10 ou 11 dígitos')
  } else {
    emit('error', '')
  }
}
</script>
```

### Campo de Dinheiro

```vue
<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}<span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <div class="relative">
      <span class="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">R$</span>
      <input
        :id="id"
        v-model="formattedValue"
        type="text"
        :class="inputClassesWithPadding"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        @blur="validate"
        @input="handleInput"
      />
    </div>
    <div v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const formatMoneyInput = (value: string): string => {
  // Remove tudo exceto números
  const cleaned = value.replace(/\D/g, '')
  
  // Converte para centavos
  const cents = parseInt(cleaned) || 0
  
  // Formata como moeda
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formattedValue = computed({
  get: () => formatMoneyInput(props.modelValue),
  set: (value) => {
    const cleaned = value.replace(/\D/g, '')
    emit('update:modelValue', cleaned)
  }
})

const inputClassesWithPadding = computed(() => {
  return `${inputClasses.value} pl-8`
})
</script>
```

### Campo de Percentual

```vue
<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}<span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        v-model="formattedValue"
        type="text"
        :class="inputClassesWithPadding"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        @blur="validate"
        @input="handleInput"
        @keydown="preventInvalidInput"
      />
      <span class="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400">%</span>
    </div>
    <div v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const formatPercentInput = (value: string): string => {
  // Remove caracteres não numéricos exceto vírgula e ponto
  let cleaned = value.replace(/[^\d,.]/g, '')
  
  // Substitui vírgula por ponto
  cleaned = cleaned.replace(',', '.')
  
  // Remove pontos extras, mantendo apenas o último
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Limita a 2 casas decimais
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + '.' + parts[1].substring(0, 2)
  }
  
  return cleaned
}

const formattedValue = computed({
  get: () => formatPercentInput(props.modelValue),
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const preventInvalidInput = (event: KeyboardEvent) => {
  // Permitir teclas de controle
  if (['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    return
  }
  
  // Permitir números, vírgula e ponto
  if (/[\d,.]/.test(event.key)) {
    return
  }
  
  // Bloquear outras teclas
  event.preventDefault()
}

const validate = () => {
  const value = parseFloat(props.modelValue.replace(',', '.'))
  
  if (props.required && !props.modelValue.trim()) {
    emit('error', 'Percentual é obrigatório')
  } else if (props.modelValue && (isNaN(value) || value < 0 || value > 100)) {
    emit('error', 'Percentual deve estar entre 0 e 100')
  } else {
    emit('error', '')
  }
}
</script>
```

### Campo de Data

```vue
<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}<span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <input
      :id="id"
      v-model="formattedValue"
      type="date"
      :class="inputClasses"
      :required="required"
      :disabled="disabled"
      :min="minDate"
      :max="maxDate"
      @blur="validate"
      @input="handleInput"
    />
    <div v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const formattedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const validate = () => {
  if (props.required && !props.modelValue) {
    emit('error', 'Data é obrigatória')
  } else if (props.modelValue && props.minDate && props.modelValue < props.minDate) {
    emit('error', `Data deve ser posterior a ${formatDate(props.minDate)}`)
  } else if (props.modelValue && props.maxDate && props.modelValue > props.maxDate) {
    emit('error', `Data deve ser anterior a ${formatDate(props.maxDate)}`)
  } else {
    emit('error', '')
  }
}
</script>
```

### Campo de Seleção (Select)

```vue
<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}<span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <select
      :id="id"
      v-model="modelValue"
      :class="inputClasses"
      :required="required"
      :disabled="disabled"
      @change="validate"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <div v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number
  label: string
  placeholder: string
  options: Option[]
  required?: boolean
  disabled?: boolean
  error?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'error': [error: string]
}>()

const validate = () => {
  if (props.required && !props.modelValue) {
    emit('error', `${props.label} é obrigatório`)
  } else {
    emit('error', '')
  }
}
</script>
```

### Campo de Textarea

```vue
<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}<span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <textarea
      :id="id"
      v-model="modelValue"
      :class="textareaClasses"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      @blur="validate"
      @input="handleInput"
    ></textarea>
    <div class="flex justify-between items-center mt-1">
      <div v-if="error" class="text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400">
        {{ modelValue.length }}/{{ maxLength }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const textareaClasses = computed(() => {
  const base = 'w-full px-3 py-2 rounded-lg text-sm transition-all resize-none'
  const colors = 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
  const border = props.error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
  const focus = 'focus:ring-2 focus:border-transparent'
  const disabled = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return `${base} ${colors} border ${border} ${focus} ${disabled}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  let value = target.value
  
  // Limitar caracteres se especificado
  if (props.maxLength && value.length > props.maxLength) {
    value = value.substring(0, props.maxLength)
    target.value = value
  }
  
  emit('update:modelValue', value)
}
</script>
```

## Validações

### Validações Básicas

```typescript
// Validação de email
export const validateEmail = (email: string): string => {
  if (!email.trim()) return 'Email é obrigatório'
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Email inválido'
  
  return ''
}

// Validação de telefone
export const validatePhone = (phone: string): string => {
  if (!phone.trim()) return 'Telefone é obrigatório'
  
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length < 10 || cleaned.length > 11) {
    return 'Telefone deve ter 10 ou 11 dígitos'
  }
  
  return ''
}

// Validação de CPF
export const validateCPF = (cpf: string): string => {
  if (!cpf.trim()) return 'CPF é obrigatório'
  
  const cleaned = cpf.replace(/\D/g, '')
  
  if (cleaned.length !== 11) return 'CPF deve ter 11 dígitos'
  if (/^(\d)\1{10}$/.test(cleaned)) return 'CPF inválido'
  
  // Validação dos dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.charAt(9))) return 'CPF inválido'
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.charAt(10))) return 'CPF inválido'
  
  return ''
}

// Validação de senha
export const validatePassword = (password: string): string => {
  if (!password) return 'Senha é obrigatória'
  if (password.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
  
  return ''
}

// Validação de confirmação de senha
export const validatePasswordConfirmation = (password: string, confirmation: string): string => {
  if (!confirmation) return 'Confirmação de senha é obrigatória'
  if (password !== confirmation) return 'Senhas não coincidem'
  
  return ''
}
```

### Validações de Negócio

```typescript
// Validação de horário de agendamento
export const validateAppointmentTime = (
  startTime: string,
  endTime: string,
  collaboratorId: string,
  date: string
): string => {
  const start = new Date(`${date}T${startTime}`)
  const end = new Date(`${date}T${endTime}`)
  
  if (start >= end) {
    return 'Horário de fim deve ser posterior ao horário de início'
  }
  
  if (start < new Date()) {
    return 'Não é possível agendar no passado'
  }
  
  // Verificar disponibilidade do colaborador
  if (!isCollaboratorAvailable(collaboratorId, start, end)) {
    return 'Colaborador não está disponível neste horário'
  }
  
  return ''
}

// Validação de quantidade de estoque
export const validateStockQuantity = (
  productId: string,
  quantity: number,
  operation: 'entrada' | 'saida'
): string => {
  if (quantity <= 0) {
    return 'Quantidade deve ser maior que zero'
  }
  
  if (operation === 'saida') {
    const availableStock = getAvailableStock(productId)
    if (quantity > availableStock) {
      return `Quantidade insuficiente. Disponível: ${availableStock}`
    }
  }
  
  return ''
}

// Validação de valor monetário
export const validateMoney = (value: string): string => {
  const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'))
  
  if (isNaN(numericValue)) {
    return 'Valor inválido'
  }
  
  if (numericValue < 0) {
    return 'Valor deve ser positivo'
  }
  
  if (numericValue > 999999.99) {
    return 'Valor muito alto'
  }
  
  return ''
}

// Validação de percentual
export const validatePercentage = (value: string): string => {
  const numericValue = parseFloat(value.replace(',', '.'))
  
  if (isNaN(numericValue)) {
    return 'Percentual inválido'
  }
  
  if (numericValue < 0) {
    return 'Percentual deve ser positivo'
  }
  
  if (numericValue > 100) {
    return 'Percentual não pode ser maior que 100%'
  }
  
  return ''
}
```

### Validação de Formulário Completo

```typescript
// Validador genérico de formulário
export const validateForm = <T extends Record<string, any>>(
  form: T,
  rules: ValidationRules<T>
): ValidationResult<T> => {
  const errors: Partial<Record<keyof T, string>> = {}
  let isValid = true
  
  Object.entries(rules).forEach(([field, rule]) => {
    const value = form[field as keyof T]
    const error = validateField(field as keyof T, value, rule)
    
    if (error) {
      errors[field as keyof T] = error
      isValid = false
    }
  })
  
  return {
    isValid,
    errors
  }
}

// Tipos para validação
interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string
  label: string
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule
}

interface ValidationResult<T> {
  isValid: boolean
  errors: Partial<Record<keyof T, string>>
}

// Validação individual de campo
const validateField = <T>(
  field: keyof T,
  value: any,
  rule: ValidationRule
): string => {
  if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return `${rule.label} é obrigatório`
  }
  
  if (value && typeof value === 'string') {
    if (rule.minLength && value.length < rule.minLength) {
      return `${rule.label} deve ter pelo menos ${rule.minLength} caracteres`
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      return `${rule.label} deve ter no máximo ${rule.maxLength} caracteres`
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      return `${rule.label} tem formato inválido`
    }
  }
  
  if (rule.custom) {
    return rule.custom(value)
  }
  
  return ''
}

// Exemplo de uso
const clienteRules: ValidationRules<Cliente> = {
  nome: {
    required: true,
    minLength: 2,
    maxLength: 100,
    label: 'Nome'
  },
  telefone: {
    required: true,
    pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
    label: 'Telefone'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    label: 'Email'
  }
}

const validation = validateForm(clienteForm, clienteRules)
if (!validation.isValid) {
  // Tratar erros
  console.log(validation.errors)
}
```

## Máscaras de Input

### Implementação de Máscaras

```typescript
// Máscara para telefone
export const phoneMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  } else {
    return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  }
}

// Máscara para CPF
export const cpfMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
}

// Máscara para CNPJ
export const cnpjMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5')
}

// Máscara para CEP
export const cepMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned.replace(/(\d{5})(\d{0,3})/, '$1-$2')
}

// Máscara para dinheiro
export const moneyMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  const number = parseInt(cleaned) / 100
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

// Máscara para porcentagem
export const percentageMask = (value: string): string => {
  // Remove caracteres não numéricos exceto vírgula e ponto
  let cleaned = value.replace(/[^\d,.]/g, '')
  
  // Substitui vírgula por ponto
  cleaned = cleaned.replace(',', '.')
  
  // Remove pontos extras, mantendo apenas o último
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Limita a 2 casas decimais
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + '.' + parts[1].substring(0, 2)
  }
  
  return cleaned
}
```

### Composable para Máscaras

```typescript
// Composable para aplicar máscaras
export const useMask = (maskType: 'phone' | 'cpf' | 'cnpj' | 'cep' | 'money' | 'percentage') => {
  const masks = {
    phone: phoneMask,
    cpf: cpfMask,
    cnpj: cnpjMask,
    cep: cepMask,
    money: moneyMask,
    percentage: percentageMask
  }
  
  const mask = masks[maskType]
  
  const applyMask = (value: string): string => {
    return mask(value)
  }
  
  const removeMask = (value: string): string => {
    return value.replace(/\D/g, '')
  }
  
  return {
    applyMask,
    removeMask
  }
}

// Exemplo de uso
const { applyMask, removeMask } = useMask('phone')
const maskedPhone = applyMask('11987654321')  // "(11) 98765-4321"
const cleanPhone = removeMask('(11) 98765-4321')  // "11987654321"
```

## Tratamento de Erros

### Estrutura de Erros

```typescript
interface FormError {
  field: string
  message: string
  type: 'validation' | 'server' | 'network'
}

interface FormState {
  isSubmitting: boolean
  errors: Record<string, string>
  serverError: string | null
}
```

### Composable para Gerenciamento de Erros

```typescript
export const useFormErrors = () => {
  const errors = ref<Record<string, string>>({})
  const serverError = ref<string | null>(null)
  const isSubmitting = ref(false)
  
  const setFieldError = (field: string, message: string) => {
    errors.value[field] = message
  }
  
  const clearFieldError = (field: string) => {
    delete errors.value[field]
  }
  
  const clearAllErrors = () => {
    errors.value = {}
    serverError.value = null
  }
  
  const setServerError = (message: string) => {
    serverError.value = message
  }
  
  const handleApiError = (error: any) => {
    if (error.response?.status === 422) {
      // Erros de validação do servidor
      const validationErrors = error.response.data.errors
      Object.entries(validationErrors).forEach(([field, messages]) => {
        setFieldError(field, Array.isArray(messages) ? messages[0] : messages)
      })
    } else if (error.response?.status >= 500) {
      // Erro do servidor
      setServerError('Erro interno do servidor. Tente novamente.')
    } else {
      // Outros erros
      setServerError(error.message || 'Ocorreu um erro inesperado.')
    }
  }
  
  return {
    errors: readonly(errors),
    serverError: readonly(serverError),
    isSubmitting: readonly(isSubmitting),
    setFieldError,
    clearFieldError,
    clearAllErrors,
    setServerError,
    handleApiError
  }
}
```

### Feedback Visual

```vue
<template>
  <div class="space-y-4">
    <!-- Erro do servidor -->
    <div v-if="serverError" class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
      <div class="flex items-center">
        <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
        {{ serverError }}
      </div>
    </div>
    
    <!-- Sucesso -->
    <div v-if="successMessage" class="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg">
      <div class="flex items-center">
        <CheckCircleIcon class="h-5 w-5 mr-2" />
        {{ successMessage }}
      </div>
    </div>
    
    <!-- Campos com erro -->
    <div v-for="(error, field) in errors" :key="field" class="text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </div>
    
    <!-- Loading -->
    <div v-if="isSubmitting" class="flex items-center justify-center py-4">
      <div class="animate-spin h-6 w-6 border-2 border-primary-600 border-t-transparent rounded-full"></div>
      <span class="ml-2 text-gray-600 dark:text-gray-400">Salvando...</span>
    </div>
  </div>
</template>
```

## Implementação em React Native

### Componente de Input para React Native

```javascript
import React, { useState } from 'react'
import { TextInput, View, Text, StyleSheet } from 'react-native'

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  error,
  mask,
  keyboardType = 'default',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  
  const handleTextChange = (text) => {
    let processedText = text
    
    if (mask) {
      processedText = mask(text)
    }
    
    onChangeText(processedText)
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError
        ]}
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputFocused: {
    borderColor: '#0EA5E9',
    borderWidth: 2,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
})

export default Input
```

### Validação para React Native

```javascript
import { useState, useEffect } from 'react'

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const validateField = (field, value) => {
    const rule = validationRules[field]
    if (!rule) return ''
    
    if (rule.required && (!value || value.trim() === '')) {
      return `${rule.label} é obrigatório`
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      return `${rule.label} deve ter pelo menos ${rule.minLength} caracteres`
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      return `${rule.label} tem formato inválido`
    }
    
    if (rule.custom) {
      return rule.custom(value)
    }
    
    return ''
  }
  
  const validateForm = () => {
    const newErrors = {}
    let isValid = true
    
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })
    
    setErrors(newErrors)
    return isValid
  }
  
  const setValue = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  const handleSubmit = async (onSubmit) => {
    setIsSubmitting(true)
    
    if (validateForm()) {
      try {
        await onSubmit(values)
      } catch (error) {
        console.error('Erro ao submeter formulário:', error)
      }
    }
    
    setIsSubmitting(false)
  }
  
  return {
    values,
    errors,
    isSubmitting,
    setValue,
    validateForm,
    handleSubmit
  }
}
```

### Máscaras para React Native

```javascript
// Máscara de telefone
export const phoneMask = (value) => {
  const cleaned = value.replace(/\D/g, '')
  
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  } else {
    return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  }
}

// Máscara de CPF
export const cpfMask = (value) => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
}

// Máscara de dinheiro
export const moneyMask = (value) => {
  const cleaned = value.replace(/\D/g, '')
  const number = parseInt(cleaned) || 0
  return (number / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

// Hook para máscaras
export const useMask = (maskType) => {
  const masks = {
    phone: phoneMask,
    cpf: cpfMask,
    money: moneyMask
  }
  
  const mask = masks[maskType]
  
  const applyMask = (value) => mask(value)
  const removeMask = (value) => value.replace(/\D/g, '')
  
  return { applyMask, removeMask }
}
```

## Testes de Formulários

### Testes Unitários

```typescript
describe('Validações de Formulário', () => {
  test('deve validar email corretamente', () => {
    expect(validateEmail('')).toBe('Email é obrigatório')
    expect(validateEmail('invalid')).toBe('Email inválido')
    expect(validateEmail('user@example.com')).toBe('')
  })
  
  test('deve validar telefone corretamente', () => {
    expect(validatePhone('')).toBe('Telefone é obrigatório')
    expect(validatePhone('123')).toBe('Telefone deve ter 10 ou 11 dígitos')
    expect(validatePhone('11987654321')).toBe('')
  })
  
  test('deve aplicar máscara de telefone corretamente', () => {
    expect(phoneMask('11987654321')).toBe('(11) 98765-4321')
    expect(phoneMask('1133334444')).toBe('(11) 3333-4444')
  })
  
  test('deve validar formulário completo', () => {
    const form = { nome: '', email: 'invalid' }
    const rules = {
      nome: { required: true, label: 'Nome' },
      email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'Email' }
    }
    
    const result = validateForm(form, rules)
    
    expect(result.isValid).toBe(false)
    expect(result.errors.nome).toBe('Nome é obrigatório')
    expect(result.errors.email).toBe('Email tem formato inválido')
  })
})
```

### Testes de Integração

```typescript
describe('Formulário de Cliente', () => {
  test('deve submeter formulário válido', async () => {
    const mockSubmit = jest.fn()
    const form = {
      nome: 'João Silva',
      telefone: '11987654321',
      email: 'joao@example.com'
    }
    
    const { result } = renderHook(() => useFormValidation(form, clienteRules))
    
    await act(async () => {
      await result.current.handleSubmit(mockSubmit)
    })
    
    expect(mockSubmit).toHaveBeenCalledWith(form)
  })
  
  test('deve mostrar erros de validação', async () => {
    const form = { nome: '', telefone: '123' }
    const { result } = renderHook(() => useFormValidation(form, clienteRules))
    
    act(() => {
      result.current.validateForm()
    })
    
    expect(result.current.errors.nome).toBe('Nome é obrigatório')
    expect(result.current.errors.telefone).toBe('Telefone deve ter 10 ou 11 dígitos')
  })
})
```

## Considerações de Performance

### Otimizações

```typescript
// Debounce para validação em tempo real
export const useDebouncedValidation = (value: string, validator: (value: string) => string, delay: number = 300) => {
  const [error, setError] = useState('')
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const validationError = validator(value)
      setError(validationError)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [value, validator, delay])
  
  return error
}

// Memoização de validações custosas
export const memoizedValidator = memoize((value: string, pattern: RegExp) => {
  return pattern.test(value)
})
```

### Lazy Loading de Validações

```typescript
// Carregar validações sob demanda
export const loadValidationRules = async (formType: string) => {
  const module = await import(`./validations/${formType}`)
  return module.default
}
```
