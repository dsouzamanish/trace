```` markdown
**Technical Requirements Document (TRD)**

Project Name: Momentum — Blockers Tracker & Insights Platform

Version: 1.1

Prepared by: Product Manager (for Engineering Manager Team Productivity Project)

**1. Objective**

To build an internal productivity improvement tool (“Momentum”) that enables team members to log daily blockers, analyze productivity patterns, and allow managers to view team-wide insights. Each user can log in to view their blockers, trends, and AI-generated personal improvement suggestions. The app will leverage Contentstack CMS for structured data storage and Contentstack Launch for hosting and backend logic.

**2. Background**

Blockers that impact productivity are often discussed informally and not systematically tracked. This tool creates a transparent and data-driven mechanism to record, analyze, and resolve blockers using structured entries in Contentstack, Slack integration for ease of logging, and AI insights for action items.

**3. Goals**

*   Allow users to log blockers via Slack and also view their logs and insights on a Momentum Web App.
*   Enable manager dashboards for aggregated reports and team analytics.
*   Implement a Team Member content model to manage organization hierarchy and relationships.
*   Generate AI-driven insights for individuals and teams.

**4. Non-Goals**

*   Replace existing project management or HR systems.
*   Real-time blocker discussion or ticket assignment.

**5. System Overview**

Team members can log blockers via Slack using a command. The data flows into Contentstack as structured entries. Managers and individual users can log in to Momentum (hosted on Launch) to view dashboards. An AI module generates periodic reports highlighting recurring blockers and actionable recommendations.

**6. Content Models in Contentstack**

**6.1 Content Type: Team Member**

Fields: first\_name, last\_name, email, profile\_pic, designation, team, is\_manager, slack\_id.
Each Blocker references a Team Member entry.

**6.2 Content Type: Blocker**

Fields: team\_member (reference), description, category, severity, timestamp, status, reported\_via, manager\_notes.

**6.3 Content Type: AI Report**

Fields: report\_type, target\_member (reference), report\_period, summary, action\_items, generated\_at.

**7. Functional Requirements**

**7.1 User Authentication & Access**

OAuth-based login via Slack or Google. System maps email/slack\_id to Team Member entry. Access levels: Individual (own data), Manager (team data), Admin (all).

**7.1.1 Auto-Registration via Google OAuth**

When a user logs in via Google OAuth for the first time:
1. System checks if a Team Member entry exists with the user's email
2. If not found, automatically creates a new Team Member entry with:
   - `first_name`: From Google profile
   - `last_name`: From Google profile
   - `email`: From Google account (unique identifier)
   - `profile_pic_url`: Google profile picture URL (stored as text field for external URLs)
   - `designation`: "Other" (default, user can update later)
   - `is_manager`: false (default, admin can promote)
   - `status`: "Active"
3. User is then issued a JWT token for subsequent API requests
4. On subsequent logins, existing Team Member entry is retrieved and used

**Flow Diagram:**
```
Google OAuth Login
       ↓
  validateGoogleUser()
       ↓
  findByEmail(email)
       ↓
┌─────────────────┐
│  User exists?   │
└─────────────────┘
    │         │
   YES       NO
    │         │
    ↓         ↓
 Return    Create new
 existing  team member
 user      in Contentstack
    │         │
    └────┬────┘
         ↓
  Generate JWT Token
         ↓
  Return AuthResponse
```

**7.2 Slack Integration**

Slash command `/blocker` opens a modal. Submissions create Blocker entries in Contentstack via Launch webhook.

**7.3 Momentum Web App (Launch Frontend)**

*   Personal Dashboard: Displays user’s blockers, trends, and AI summaries.
*   Team Dashboard: Managers see team-level data, comparison charts, and AI insights.

**7.4 AI Insight Generation**

Weekly serverless job analyzes blockers to create AI Reports for individuals and teams with suggested actions.

**8. User Roles & Permissions**

*   Individual User: View own blockers and AI reports.
*   Manager: View team-level blockers and reports.
*   Admin: Manage content and integration settings.

**9. Technical Architecture**

Slack Command → Launch Function → Contentstack Entry → Launch Dashboard → AI Function → AI Report Entry.

**10. API Integrations**

Slack API → Launch Webhook → Contentstack → Launch App → OpenAI API (via Launch Function).

**11. Security & Performance**

OAuth login, role-based access control, environment variable key storage, rate limiting for Slack submissions. Slack submissions <2s; dashboard <1s (cached).

**12. Success Metrics**

% of users logging blockers weekly >80%, average blocker resolution time reduced by 25%, AI recommendation accuracy >70%, satisfaction +20%.

**13. UX Wireframe Descriptions**

1.  Slack Modal: Input fields for description, category, severity.
2.  Personal Dashboard: Cards showing weekly blocker count, trend chart, AI summary.
3.  Manager Dashboard: Filters by team, category, member, and a summary panel with AI insights.
4.  AI Report Card: Displays AI-generated recommendations with timestamps.

Wireframes

Slack blocker Logging

Personal Dashboard

Managers Dashboard

AI report

---

**⚙️ End-to-End Flow: /blocker → Webhook → Contentstack Automation → Entry Creation**

**Overview**

You’ll use Slack + Contentstack Automations + Webhook integration to automatically create “Blocker” entries in your CMS, without needing a custom backend hosted elsewhere.

1.  A user enters the command `/blocker` in Slack.
2.  A Slack modal opens, prompting the user to provide blocker details such as description, category, and severity.
3.  When submitted, Slack sends a JSON payload to a Webhook trigger URL defined in Contentstack Automations.
4.  The automation recipe processes the payload and performs the following actions:
    *   Finds or creates a corresponding Team Member entry in the “team\_member” content type.
    *   Creates a new Blocker entry referencing that Team Member.
    *   Optionally sends a success confirmation message back to Slack.

**Slack Command Setup**

*   Command: `/blocker`
*   Request URL: Contentstack Automation Webhook URL
*   Description: “Log a work blocker”
*   Usage Hint: “/blocker <describe your blocker>”

**Automation Recipe Definition**

**Trigger:** Incoming Webhook
*   Triggered by Slack’s modal submission payload.

**Steps:**
1.  Find Team Member entry by Slack email or Slack user ID.
2.  If not found, create a new Team Member entry using Slack user details.
3.  Create a new Blocker entry using the following field mapping:
    *   Description → payload.submission.description
    *   Category → payload.submission.category
    *   Severity → payload.submission.severity
    *   Timestamp → payload.timestamp
    *   Reported\_via → “Slack”
    *   Team Member → Reference to the found/created team\_member entry
4.  (Optional) Send confirmation message back to Slack using response\_url.

**Data Flow Diagram**

\[Slack User\]
↓ (Slash Command / Modal)
\[Slack App\]
↓ (Webhook Payload)
\[Contentstack Automations Webhook Trigger\]
↓
\[Find/Create Team Member Entry\]
↓
\[Create Blocker Entry\]
↓
(Optional)
\[Send Confirmation Back to Slack\]

**Security Considerations**

*   Restrict webhook to verified Slack requests using signing secrets.
*   Use Slack’s “X-Slack-Signature” header verification to ensure authenticity.
*   Store Slack tokens securely using environment variables in the Automation configuration.

---

**🧩 1. Content Type: Team Member**

| **Property** | **Details** |
| :---: | :---: |
| Title | Team Member |
| UID | team\_member |
| Description | Stores details of each team member to associate blockers with them. |
| Type | Single (not multiple entries per record) |
| Display Name | {{first\_name}} {{last\_name}} |

**Schema Design**

| **Field UID** | **Display Name** | **Type** | **Description** | **Validations / Options** |
| :---: | :---: | :---: | :---: | :---: |
| first\_name | First Name | Text | Member’s first name | Required: ✅ |
| last\_name | Last Name | Text | Member’s last name | Required: ✅ |
| email | Email | Text | Used for login/Slack mapping | Required: ✅, Unique: ✅ |
| slack\_id | Slack ID | Text | Slack user ID used to link submissions | Optional |
| profile\_pic | Profile Picture | File | Profile image of member | File type: Image only |
| designation | Designation | Select | Member’s role in the team | Options: Engineer, Sr. Engineer, Tech Lead, QA, Manager, Other |
| team | Team | Text | Team name or function (e.g. CMS Core, QA Automation) | Optional |
| is\_manager | Is Manager | Boolean | Marks if the user can view team data | Default: false |
| joined\_date | Joined Date | Date | (Optional) Date user joined team | Optional |
| status | Status | Select | Active or Inactive user | Options: Active, Inactive |

```json
{
  "title": "Team Member",
  "uid": "team_member",
  "schema": [
    { "display_name": "First Name", "uid": "first_name", "data_type": "text", "mandatory": true },
    { "display_name": "Last Name", "uid": "last_name", "data_type": "text", "mandatory": true },
    { "display_name": "Email", "uid": "email", "data_type": "text", "mandatory": true, "unique": true },
    { "display_name": "Slack ID", "uid": "slack_id", "data_type": "text" },
    { "display_name": "Profile Picture", "uid": "profile_pic", "data_type": "file", "field_metadata": { "extensions": ["jpg", "png", "jpeg"] } },
    { "display_name": "Profile Picture URL", "uid": "profile_pic_url", "data_type": "text", "field_metadata": { "description": "External profile picture URL (e.g., from Google OAuth)" } },
    { "display_name": "Designation", "uid": "designation", "data_type": "select", "enum": ["Engineer", "Sr. Engineer", "Tech Lead", "QA", "Manager", "Other"] },
    { "display_name": "Team", "uid": "team", "data_type": "text" },
    { "display_name": "Is Manager", "uid": "is_manager", "data_type": "boolean", "default_value": false },
    { "display_name": "Joined Date", "uid": "joined_date", "data_type": "date" },
    { "display_name": "Status", "uid": "status", "data_type": "select", "enum": ["Active", "Inactive"], "default_value": "Active" }
  ]
}

````

-----

**🧱 2. Content Type: Blocker**

| **Property** | **Details**                                                 |
| :----------: | :---------------------------------------------------------: |
| Title        | Blocker                                                     |
| UID          | blocker                                                     |
| Description  | Stores each blocker entry reported by a team member         |
| Display Name | {{team\_member.first\_name}} - {{category}} - {{timestamp}} |

**Schema Fields**

| **Field UID**      | **Display Name** | **Type**        | **Description**                       | **Validations / Options**                                      |
| :----------------: | :--------------: | :-------------: | :-----------------------------------: | :------------------------------------------------------------: |
| team\_member       | Team Member      | Reference       | Links to the team member entry        | Reference to team\_member                                      |
| description        | Description      | Multi Line Text | Description of blocker                | Required: ✅                                                    |
| category           | Category         | Select          | Type of blocker                       | Options: Process, Technical, Dependency, Infrastructure, Other |
| severity           | Severity         | Select          | Impact level                          | Options: Low, Medium, High                                     |
| timestamp          | Reported At      | DateTime        | Time of submission                    | Auto-set via Automation                                        |
| status             | Status           | Select          | State of blocker                      | Options: Open, Resolved, Ignored                               |
| reported\_via      | Reported Via     | Text            | Source of submission                  | Default: Slack or Web                                          |
| manager\_notes     | Manager Notes    | Rich Text       | Optional comments or resolution notes | Optional                                                       |
| slack\_message\_id | Slack Message ID | Text            | For cross-reference with Slack        | Optional                                                       |
| attachments        | Attachments      | File            | Optional screenshots or files         | File type: Any                                                 |

``` json
{
  "title": "Blocker",
  "uid": "blocker",
  "schema": [
    { "display_name": "Team Member", "uid": "team_member", "data_type": "reference", "reference_to": ["team_member"], "mandatory": true },
    { "display_name": "Description", "uid": "description", "data_type": "text", "field_metadata": { "multiline": true }, "mandatory": true },
    { "display_name": "Category", "uid": "category", "data_type": "select", "enum": ["Process", "Technical", "Dependency", "Infrastructure", "Other"], "mandatory": true },
    { "display_name": "Severity", "uid": "severity", "data_type": "select", "enum": ["Low", "Medium", "High"], "mandatory": true },
    { "display_name": "Reported At", "uid": "timestamp", "data_type": "isodate", "mandatory": true },
    { "display_name": "Status", "uid": "status", "data_type": "select", "enum": ["Open", "Resolved", "Ignored"], "default_value": "Open" },
    { "display_name": "Reported Via", "uid": "reported_via", "data_type": "text", "default_value": "Slack" },
    { "display_name": "Manager Notes", "uid": "manager_notes", "data_type": "rich_text" },
    { "display_name": "Slack Message ID", "uid": "slack_message_id", "data_type": "text" },
    { "display_name": "Attachments", "uid": "attachments", "data_type": "file" }
  ]
}

```
