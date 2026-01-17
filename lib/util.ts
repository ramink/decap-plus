// These secrets are set in Pages settings.
interface Env {
  CF_ACCOUNT_ID: string;
  CF_API_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_TOKEN: string;
}

export async function mergeFromStaging(env: Env): Promise<void> {
  const token = env.GITHUB_TOKEN;
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const base = "main";
  const head = "staging";

  const api = "https://api.github.com";
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "cloudflare-pages-function",
  };

  const getRefSha = async (branch: string): Promise<string> => {
    const res = await fetch(
      `${api}/repos/${owner}/${repo}/git/ref/heads/${branch}`,
      { headers }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch ref for ${branch}`);
    }
    return (await res.json()).object.sha;
  };

  const baseSha = await getRefSha(base);
  const headSha = await getRefSha(head);

  const compareRes = await fetch(
    `${api}/repos/${owner}/${repo}/compare/${baseSha}...${headSha}`,
    { headers }
  );
  if (!compareRes.ok) {
    throw new Error("Compare failed");
  }

  const compare = await compareRes.json();
  
  // silently succeed if already merged
  if (compare.status === "identical") {
    return;
  }

  if (compare.status !== "ahead") {
    throw new Error(`Cannot fast-forward: branch is ${compare.status}`);
  }

  const updateRes = await fetch(
    `${api}/repos/${owner}/${repo}/git/refs/heads/${base}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        sha: headSha,
        force: false,
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.text();
    throw new Error(`Ref update failed: ${err}`);
  }
}

export async function initiateDeployment(accountID: string, token: string, projectName: string) : Promise<Response> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountID}/pages/projects/${projectName}/deployments`;

  // Trigger deployment using the latest branch state
  return await fetch( url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // optional: you can specify branch explicitly, default is production branch
      // branch: 'main'
    }),
  });
}
