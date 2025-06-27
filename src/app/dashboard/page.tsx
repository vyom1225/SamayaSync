import { authenticateUser } from "@/utils/hooks"

function page() {
  const session = authenticateUser();
  return (
    <div>This is dashboard my friends</div>
  )
}
export default page