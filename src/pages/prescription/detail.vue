<template>
    <div class="prescription-detail">
        处方详情页
        <pre>
        {{prescription}}
        </pre>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                prescriptionid: 0,
                prescription: {},
            }
        },
        created() {
            let self = this;
            self.prescriptionid = self.$route.params.id;

            self.fetchData();
        },
        methods: {
            fetchData() {
                let self = this;
                self.$api.prescription.one(self.prescriptionid)
                    .then(({data}) => {
                        self.prescription = data.prescription;
                    })
            },
        }
    }
</script>

<style lang='less' scoped>
</style>
