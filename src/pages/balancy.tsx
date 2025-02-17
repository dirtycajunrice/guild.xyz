import { IconButton, SimpleGrid, Stack, useColorMode } from "@chakra-ui/react"
import AddBalancyRequirementCard from "components/balancy/AddBalancyRequirementCard"
import BalancyBar from "components/balancy/BalancyBar"
import BalancyFormCard from "components/balancy/BalancyFormCard"
import BalancyLogicPicker from "components/balancy/BalancyLogicPicker"
import Layout from "components/common/Layout"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import REQUIREMENT_FORMCARDS from "components/create-guild/Requirements/formCards"
import { TwitterLogo } from "phosphor-react"
import { useEffect } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { Requirement, RequirementType } from "types"

const Page = (): JSX.Element => {
  const methods = useForm({ mode: "all" })
  const { control, getValues, setValue, clearErrors } = methods

  const { fields, append, remove } = useFieldArray({
    name: "requirements",
    control,
  })

  const watchFieldArray = methods.watch("requirements")
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }))

  const addRequirement = (type: RequirementType) => {
    append({
      type,
      address: null,
      data: {},
    })
  }

  // Setting up the dark mode, because this is a "static" page
  const { setColorMode } = useColorMode()

  useEffect(() => {
    setColorMode("dark")
  }, [])

  return (
    <Layout
      title="Balancy playground"
      // image={<Icon boxSize={12} as={Cpu} mb="-6px" />}
      description="See how many addresses satisfy requirements and make allowlists out of them"
      showBackButton={false}
      background="gray.500"
      textColor="white"
      backgroundOffset={46}
      action={
        <IconButton
          as="a"
          target="_blank"
          href={"https://twitter.com/balancy_io"}
          rel="noopener"
          borderRadius={"full"}
          h="10"
          aria-label="Balancy twitter"
          icon={<TwitterLogo />}
        />
      }
    >
      <FormProvider {...methods}>
        <BalancyBar />
        <Stack spacing="6" pt="8">
          <BalancyLogicPicker />
          <SimpleGrid
            position="relative"
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 4, md: 5 }}
          >
            {controlledFields.map((field: Requirement, i) => {
              const type: RequirementType = getValues(`requirements.${i}.type`)
              const RequirementFormCard = REQUIREMENT_FORMCARDS[type]
              if (RequirementFormCard) {
                return (
                  <BalancyFormCard
                    baseFieldPath={`requirements.${i}`}
                    type={type}
                    onRemove={() => remove(i)}
                    key={field.id}
                  >
                    <RequirementFormCard
                      field={field}
                      baseFieldPath={`requirements.${i}`}
                    />
                  </BalancyFormCard>
                )
              }
            })}
            <AddBalancyRequirementCard onAdd={addRequirement} />
          </SimpleGrid>
        </Stack>

        <DynamicDevTool control={methods.control} />
      </FormProvider>
    </Layout>
  )
}

export default Page
