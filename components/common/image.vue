<template>
  <div v-if="isLoading" :class="$attrs.class" class="image_loader">
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
  </div>
  <img
    v-else
    :src="imgSrc"
    :class="($attrs.class || []).concat(categoryClass)"
  />
</template>
<script>
export default {
  props: {
    src: String,
    fallBackSrc: String,
  },
  computed: {
    categoryClass() {
      if (this.fallbackSrcChoosen) {
        return ['category-img']
      }
      return []
    },
  },
  data() {
    return {
      isLoading: true,
      fallbackSrcChoosen: false,
    }
  },
  mounted() {
    const img = new Image()
    img.src = this.src
    this.fallbackSrcChoosen = false
    img.onload = (e) => {
      this.$emit('load', e)
      this.imgSrc = img.src
      this.isLoading = false
    }
    img.onerror = (e) => {
      img.src = this.fallBackSrc
      if (this.fallbackSrcChoosen) {
        this.$emit('error', e)
      }
      this.fallbackSrcChoosen = true
    }
  },
}
</script>
<style scoped>
.image_loader {
  width: 40px;
  height: 40px;

  position: relative;
  margin: 100px auto;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #fb2929;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
.category-img {
  width: 100px;
}
</style>
