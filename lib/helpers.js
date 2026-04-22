export const generateNavigationLink = function ({
  location,
  category,
  coachName
}) {
  return `/${location?.toLowerCase()}/${category?.toLowerCase()}/${coachName?.toLowerCase()}-1`.replaceAll(" ", "-")
}