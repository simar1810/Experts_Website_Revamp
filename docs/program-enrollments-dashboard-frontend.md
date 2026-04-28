# Program enrollments — dashboard (frontend contract)

Frontend uses the Experts API with the same **`client`** JWT as elsewhere (`requireAuth("client")`).

## Endpoint in use today

| Use case | Path | Method |
|----------|------|--------|
| List (`/dashboard/programs`) **and** detail lookup | `/experts/client/program-enrollments` | GET |

Detail route **`/dashboard/programs/[enrollmentId]`** calls the **same list** endpoint and selects the row whose **`_id`** equals **`enrollmentId`** in the URL.

## Optional backend enhancement

If you add **`GET /experts/client/program-enrollments/:enrollmentId`** with a richer enrollment payload (assigned meal plan, workout, nudges, resolved tables, etc.), the frontend can switch the detail page to that route and use **`enrollmentFromDetailApiResponse`** (`lib/dashboardProgramEnrollment.js`). Until then, only fields present on list items are available.

## Detail UI (same list row)

Where the list payload includes nested **`program`**, **`coach`**, and assignment fields, the detail screen still renders:

- Overview, tags, meta from **`program`**
- Meal plan / workout / nudges via **`resolve*ForDisplay`** helpers — prefers **`assigned*`** when present on the enrollment, otherwise **`program.linked*`**
- **`assignedMealPlanTablesResolved`**, exercises from **`assignedWorkout`**, **`program.faqs`**, etc., when the list response includes them
